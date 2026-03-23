// app/api/image/route.ts (Next 13+)
export async function GET(req: Request) {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");

    const res = await fetch(imageUrl!);
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type": res.headers.get("content-type") || "image/jpeg",
        },
    });
}
