import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

function isMissingColumn(errorMessage: string, column: string) {
  const msg = errorMessage.toLowerCase();
  return msg.includes(column.toLowerCase()) && msg.includes("column");
}

export async function GET() {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let { data, error } = await supabase
      .from("ai_rules")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Backward-compatible fetch when table has no created_at.
    if (error && isMissingColumn(error.message, "created_at")) {
      const retry = await supabase
        .from("ai_rules")
        .select("*")
        .eq("user_id", user.id);
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { rule, is_active } = await request.json();
    if (!rule?.trim()) {
      return NextResponse.json({ error: "Rule is required" }, { status: 400 });
    }

    let { data, error } = await supabase
      .from("ai_rules")
      .insert({
        user_id: user.id,
        rule: rule.trim(),
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error && isMissingColumn(error.message, "is_active")) {
      const retry = await supabase
        .from("ai_rules")
        .insert({
          user_id: user.id,
          rule: rule.trim(),
        })
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, rule, is_active } = await request.json();
    if (!id || !rule?.trim()) {
      return NextResponse.json(
        { error: "ID and rule are required" },
        { status: 400 }
      );
    }

    let { data, error } = await supabase
      .from("ai_rules")
      .update({
        rule: rule.trim(),
        is_active: is_active ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (
      error &&
      (isMissingColumn(error.message, "is_active") ||
        isMissingColumn(error.message, "updated_at"))
    ) {
      const retry = await supabase
        .from("ai_rules")
        .update({ rule: rule.trim() })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("ai_rules")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
