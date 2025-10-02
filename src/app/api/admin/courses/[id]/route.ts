import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({ success: true, message: "Dummy DELETE" });
}

export async function PATCH() {
  return NextResponse.json({ success: true, message: "Dummy PATCH" });
}
