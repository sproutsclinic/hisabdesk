const originalRepeat = String.prototype.repeat;

String.prototype.repeat = function(count) {
  const n = Number(count);

  if (!Number.isFinite(n) || n < 0) {
    console.error("🚨 INVALID repeat() DETECTED");
    console.error("Value:", count);
    console.trace("Stack trace:");

    // prevent crash so build can continue
    return "";
  }

  return originalRepeat.call(this, n);
};
