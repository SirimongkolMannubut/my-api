import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    body.age = parseInt(body.age);
    body.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db("testdb");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );

    return Response.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("testdb");

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(params.id)
    });

    return Response.json({ deletedCount: result.deletedCount });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}