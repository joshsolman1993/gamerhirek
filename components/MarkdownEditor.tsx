"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CldUploadWidget } from "next-cloudinary";

// A szerkesztő csak kliens oldalon tölthető be
const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div style={{ height: "500px", background: "var(--color-site-card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-site-muted)" }}>Szerkesztő betöltése...</div>
});

import rehypeRaw from "rehype-raw";

export function MarkdownEditor({ initialValue = "" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (result: any) => {
    const url = result?.info?.secure_url;
    if (url) {
      // Beszúrjuk az új képet a meglévő tartalomhoz (vagy a kurzorhoz, itt most hozzáadjuk a végéhez/vagy megkereshetjük a kurzort ha van API hozzá)
      // A legegyszerűbb, ha hozzáfűzzük a tartalomhoz
      const imageMarkdown = `\n![kép](${url})\n`;
      setValue((prev) => prev + imageMarkdown);
    }
  };

  return (
    <div data-color-mode="dark" style={{ width: "100%" }}>
      {/* Rejtett mező a Next.js Server Action FormData feltöltéséhez */}
      <input type="hidden" name="content" value={value} />
      
      {/* Képfeltöltés Gomb */}
      <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
        <CldUploadWidget 
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "gamerhirek"} 
          onSuccess={handleUploadSuccess}
          options={{
            multiple: false,
            maxFiles: 1,
            resourceType: "image",
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="admin-btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Kép beszúrása (Cloudinary)
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Editor */}
      <div style={{ border: "1px solid var(--color-site-border)", borderRadius: "4px", overflow: "hidden" }}>
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || "")}
          height={500}
          previewOptions={{
             rehypePlugins: [[rehypeRaw]]
          }}
          style={{ background: "var(--color-site-bg)", border: "none" }}
        />
      </div>
    </div>
  );
}
