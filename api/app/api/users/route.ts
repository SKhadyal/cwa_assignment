import { NextResponse } from "next/server";
import User from "@/models/User";
import { ensureDatabase } from "@/lib/sequelize";

export const runtime = "nodejs";

export async function GET() {
  await ensureDatabase();
  const users = await User.findAll({ order: [["id", "ASC"]] });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await ensureDatabase();

  const { name, email } = await request.json();
  if (!name || !email) {
    return NextResponse.json(
      { error: "Both name and email are required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.create({ name, email });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create user", details: `${error}` },
      { status: 500 }
    );
  }
}
