import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST() {
  try {
    const supabase = await createClient();
    
    // 1. Get Session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Data from your existing tables
    const [incomesRes, familyRes] = await Promise.all([
      supabase.from("incomes").select("amount").eq("user_id", user.id),
      supabase.from("family_members").select("name, annual_income, relation").eq("user_id", user.id)
    ]);

    const totalIncome = incomesRes.data?.reduce((sum, i) => sum + Number(i.amount), 0) || 0;
    const familyData = familyRes.data || [];

    // 3. AI Logic
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an expert Indian Tax Strategist. 
      Context: New Tax Regime (Budget 2026). Individual zero-tax limit is ₹12.75 Lakhs.
      
      User Total Income: ₹${totalIncome}
      Family Members and their current incomes: ${JSON.stringify(familyData)}
      
      Task:
      Calculate if income can be shifted to family members to keep the primary user below the ₹12.75L slab.
      If the user is already below ₹12.75L, focus on long-term family wealth growth.
      
      Return ONLY a JSON object:
      {
        "total_tax_saved": number,
        "recommendations": [
          { "to": "name", "amount": number, "reason": "e.g. Consulting fee for social media management", "legal_clause": "string" }
        ],
        "risk_note": "Brief advice on Section 64 (Clubbing of income) prevention."
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean JSON in case Gemini adds markdown blocks
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    const strategy = JSON.parse(cleanedJson);

    // 4. Save Strategy to your DB
    const { error: insertError } = await supabase.from("family_shift_strategies").insert({
      user_id: user.id,
      ai_output: strategy,
      estimated_savings: strategy.total_tax_saved
    });

    if (insertError) throw insertError;

    return NextResponse.json(strategy);
  } catch (error: any) {
    console.error("Strategy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}