import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("testdb");

    const users = await db.collection("users").find({}).toArray();

    return Response.json(users);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    body.createdAt = new Date();
    body.age = parseInt(body.age);

    const client = await clientPromise;
    const db = client.db("testdb");

    const result = await db.collection("users").insertOne(body);

    return Response.json({ insertedId: result.insertedId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}