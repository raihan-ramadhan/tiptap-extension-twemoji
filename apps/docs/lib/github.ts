"use server";

export async function getStarCount(): Promise<number | null> {
  let starCount: number | null = null;

  try {
    const res = await fetch(
      "https://api.github.com/repos/raihan-ramadhan/tiptap-extension-twemoji",
      {
        // revalidate every 1 hour
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      starCount = data?.stargazers_count ?? null;
    }
  } catch {
    starCount = null;
  }

  return starCount;
}
