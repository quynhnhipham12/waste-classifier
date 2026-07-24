import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Type, Table as TableIcon, ImageIcon, Bold, Italic, Underline,
  List, ListOrdered, Trash2, Plus, Minus, Upload as UploadIcon,
} from "lucide-react";
import apiClient from "../../api/client";

const BUILTIN_FONTS = [
  { label: "Mặc định", value: "inherit" },
  { label: "Serif trang trọng", value: "Georgia, serif" },
  { label: "Sans hiện đại", value: "Poppins, sans-serif" },
  { label: "Monospace", value: "'Courier New', monospace" },
];

let blockIdCounter = 0;
const newId = () => `block_${Date.now()}_${blockIdCounter++}`;

// Bọc phần chữ đang bôi đen bằng 1 <span> có style riêng
function wrapSelection(style) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) {
    alert("Bôi đen đoạn chữ cần chỉnh trước đã nhé.");
    return;
  }
  const range = sel.getRangeAt(0);
  const span = document.createElement("span");
  Object.assign(span.style, style);
  try {
    range.surroundContents(span);
  } catch {
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }
}

function useCustomFonts() {
  const [fonts, setFonts] = useState([]);
  useEffect(() => {
    apiClient.get("/fonts").then((res) => {
      setFonts(res.data);
      const styleTag = document.createElement("style");
      styleTag.id = "custom-fonts-style";
      styleTag.innerHTML = res.data
        .map(
          (f) => `@font-face { font-family: "${f.name}"; src: url(${f.font_data}) format("${f.format}"); }`
        )
        .join("\n");
      document.head.querySelector("#custom-fonts-style")?.remove();
      document.head.appendChild(styleTag);
    });
  }, []);
  return fonts;
}

function TextBlock({ block, active, onChange, fontOptions }) {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#1a1a1a");

  const exec = (cmd, value = null) => {
    ref.current.focus();
    document.execCommand(cmd, false, value);
    onChange({ ...block, html: ref.current.innerHTML });
  };

  const applyFont = (fontName) => {
    ref.current.focus();
    wrapSelection({ fontFamily: fontName });
    onChange({ ...block, html: ref.current.innerHTML });
  };

  const applySize = () => {
    ref.current.focus();
    wrapSelection({ fontSize: `${fontSize}px` });
    onChange({ ...block, html: ref.current.innerHTML });
  };

  const applyColor = (val) => {
    setColor(val);
    ref.current.focus();
    wrapSelection({ color: val });
    onChange({ ...block, html: ref.current.innerHTML });
  };

  return (
    <div className={`rounded-2xl border p-4 transition ${active ? "border-eco-primary ring-2 ring-eco-primary/20 bg-eco-primary/5" : "border-eco-primary/10 bg-white"}`}>
      <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-eco-primary/10">
        <select onChange={(e) => applyFont(e.target.value)} className="text-sm font-body border border-eco-primary/20 rounded-lg px-2 py-1 outline-none" defaultValue="inherit">
          {fontOptions.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        <div className="flex items-center gap-1">
          <input
            type="number" min={1} max={200} value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-16 text-sm font-body border border-eco-primary/20 rounded-lg px-2 py-1 outline-none"
          />
          <button type="button" onClick={applySize} className="text-xs font-semibold text-eco-primary px-2 py-1 rounded-lg hover:bg-eco-primary/10">Áp dụng</button>
        </div>

        <input type="color" value={color} onChange={(e) => applyColor(e.target.value)} className="w-8 h-8 rounded-lg border border-eco-primary/20 cursor-pointer" />

        <button type="button" onClick={() => exec("bold")} className="p-1.5 rounded-lg hover:bg-eco-primary/10"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec("italic")} className="p-1.5 rounded-lg hover:bg-eco-primary/10"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec("underline")} className="p-1.5 rounded-lg hover:bg-eco-primary/10"><Underline className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className="p-1.5 rounded-lg hover:bg-eco-primary/10"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="p-1.5 rounded-lg hover:bg-eco-primary/10"><ListOrdered className="w-4 h-4" /></button>
      </div>
      <div
        ref={ref} contentEditable suppressContentEditableWarning
        onInput={() => onChange({ ...block, html: ref.current.innerHTML })}
        dangerouslySetInnerHTML={{ __html: block.html || "" }}
        className="min-h-[80px] font-body text-eco-ink outline-none leading-relaxed"
      />
    </div>
  );
}

function TableBlock({ block, active, onChange }) {
  const rows = block.rows || [["", ""], ["", ""]];
  const updateCell = (r, c, val) => {
    const next = rows.map((row) => [...row]);
    next[r][c] = val;
    onChange({ ...block, rows: next });
  };
  const addRow = () => onChange({ ...block, rows: [...rows, Array(rows[0].length).fill("")] });
  const removeRow = () => rows.length > 1 && onChange({ ...block, rows: rows.slice(0, -1) });
  const addCol = () => onChange({ ...block, rows: rows.map((r) => [...r, ""]) });
  const removeCol = () => rows[0].length > 1 && onChange({ ...block, rows: rows.map((r) => r.slice(0, -1)) });

  return (
    <div className={`rounded-2xl border p-4 transition ${active ? "border-eco-primary ring-2 ring-eco-primary/20 bg-eco-primary/5" : "border-eco-primary/10 bg-white"}`}>
      <div className="flex items-center gap-2 mb-3 text-sm font-body">
        <button type="button" onClick={addRow} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-eco-surface hover:bg-eco-primary/10"><Plus className="w-3.5 h-3.5" /> Hàng</button>
        <button type="button" onClick={removeRow} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-eco-surface hover:bg-eco-primary/10"><Minus className="w-3.5 h-3.5" /> Hàng</button>
        <button type="button" onClick={addCol} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-eco-surface hover:bg-eco-primary/10"><Plus className="w-3.5 h-3.5" /> Cột</button>
        <button type="button" onClick={removeCol} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-eco-surface hover:bg-eco-primary/10"><Minus className="w-3.5 h-3.5" /> Cột</button>
      </div>
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="border border-eco-primary/15 p-0">
                  <input value={cell} onChange={(e) => updateCell(r, c, e.target.value)} className="w-full px-2 py-1.5 text-sm font-body outline-none focus:bg-eco-primary/5" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImageBlock({ block, active, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...block, url: reader.result });
    reader.readAsDataURL(file);
  };
  return (
    <div className={`rounded-2xl border p-4 transition ${active ? "border-eco-primary ring-2 ring-eco-primary/20 bg-eco-primary/5" : "border-eco-primary/10 bg-white"}`}>
      {block.url ? (
        <img src={block.url} alt="Ảnh trong bài" className="w-full rounded-xl mb-3 object-cover max-h-72" />
      ) : (
        <div className="w-full h-32 rounded-xl bg-eco-surface flex items-center justify-center mb-3"><ImageIcon className="w-6 h-6 text-eco-primary/40" /></div>
      )}
      <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-eco-primary bg-eco-surface hover:bg-eco-primary/10 px-4 py-2 rounded-full transition">
        <ImageIcon className="w-4 h-4" />
        {block.url ? "Đổi ảnh khác" : "Chọn ảnh"}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
    </div>
  );
}

const BLOCK_ICON = { text: Type, table: TableIcon, image: ImageIcon };
const BLOCK_LABEL = { text: "Đoạn văn", table: "Bảng", image: "Ảnh" };

function ArticleEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id) && id !== "new";
  const customFonts = useCustomFonts();

  const fontOptions = [
    ...BUILTIN_FONTS,
    ...customFonts.map((f) => ({ label: f.name, value: f.name })),
  ];

  const [title, setTitle] = useState("");
  const [titleColor, setTitleColor] = useState("#2e6b47");
  const [published, setPublished] = useState(true);
  const [coverUrl, setCoverUrl] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [visibleFrom, setVisibleFrom] = useState("");
  const [visibleUntil, setVisibleUntil] = useState("");
  const blockRefs = useRef({});

  useEffect(() => {
    if (!isEdit) return;
    apiClient.get(`/admin/articles/${id}`).then((res) => {
      const a = res.data;
      setTitle(a.title || "");
      setTitleColor(a.title_color || "#2e6b47");
      setPublished(a.published ?? true);
      setCoverUrl(a.cover_image_url || "");
      setBlocks(a.content_blocks?.length ? a.content_blocks : []);
      setVisibleFrom(a.visible_from || "");
      setVisibleUntil(a.visible_until || "");
    });
  }, [id, isEdit]);

  const addBlock = (type) => {
    const block =
      type === "text" ? { id: newId(), type, html: "" } :
      type === "table" ? { id: newId(), type, rows: [["", ""], ["", ""]] } :
      { id: newId(), type, url: "" };
    setBlocks((prev) => [...prev, block]);
    setActiveId(block.id);
  };
  const updateBlock = (u) => setBlocks((prev) => prev.map((b) => (b.id === u.id ? u : b)));
  const removeBlock = (bid) => { setBlocks((prev) => prev.filter((b) => b.id !== bid)); if (activeId === bid) setActiveId(null); };
  const selectBlock = (bid) => { setActiveId(bid); blockRefs.current[bid]?.scrollIntoView({ behavior: "smooth", block: "center" }); };

  const handleCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFontUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    const formatMap = { ttf: "truetype", otf: "opentype", woff: "woff", woff2: "woff2" };
    const format = formatMap[ext];
    if (!format) { alert("Chỉ nhận file .ttf, .otf, .woff, .woff2"); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const name = file.name.replace(/\.[^.]+$/, "");
      await apiClient.post("/admin/fonts", { name, format, font_data: reader.result });
      window.location.reload(); // nạp lại để font mới xuất hiện trong danh sách chọn
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title, title_color: titleColor, cover_image_url: coverUrl, published,
      content_blocks: blocks,
      visible_from: visibleFrom || null,
      visible_until: visibleUntil || null,
    };
    try {
      if (isEdit) await apiClient.put(`/admin/articles/${id}`, payload);
      else await apiClient.post("/admin/articles", payload);
      navigate("/admin/articles");
    } catch {
      alert("Lưu bài báo thất bại. Kiểm tra lại đăng nhập.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-6 max-w-6xl">
      <aside className="w-56 shrink-0">
        <p className="font-body text-xs font-semibold text-eco-ink/50 uppercase tracking-wide mb-3">Cấu trúc bài báo</p>
        <div className="flex flex-col gap-1.5 mb-6">
          {blocks.map((b, idx) => {
            const Icon = BLOCK_ICON[b.type];
            const isActive = activeId === b.id;
            return (
              <div key={b.id} onClick={() => selectBlock(b.id)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer font-body text-sm transition ${isActive ? "bg-eco-primary text-white font-semibold" : "text-eco-ink/70 hover:bg-eco-surface"}`}>
                <span className="flex items-center gap-2 truncate"><Icon className="w-3.5 h-3.5 shrink-0" />{idx + 1}. {BLOCK_LABEL[b.type]}</span>
                <button onClick={(e) => { e.stopPropagation(); removeBlock(b.id); }} className={isActive ? "text-white/70 hover:text-white" : "text-eco-ink/30 hover:text-eco-accent"}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <p className="font-body text-xs font-semibold text-eco-ink/50 uppercase tracking-wide mb-2">Font chữ tùy chỉnh</p>
        <label className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-eco-primary bg-eco-surface hover:bg-eco-primary/10 px-3 py-2 rounded-full transition w-fit">
          <UploadIcon className="w-4 h-4" /> Nhập font mới
          <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} className="hidden" />
        </label>
        {customFonts.length > 0 && (
          <ul className="mt-2 font-body text-xs text-eco-ink/50 space-y-0.5">
            {customFonts.map((f) => <li key={f.id}>• {f.name}</li>)}
          </ul>
        )}
      </aside>

      <div className="flex-1">
        <h1 className="font-display text-2xl font-bold text-eco-primary mb-6">{isEdit ? "Chỉnh sửa bài báo" : "Tạo bài báo mới"}</h1>

        <div className="bg-white rounded-2xl border border-eco-primary/10 p-6 flex flex-col gap-5">
          <div>
            <label className="block font-body text-sm text-eco-ink/70 mb-1">Tiêu đề</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary" />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block font-body text-sm text-eco-ink/70 mb-1">Màu tiêu đề</label>
              <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-14 h-10 rounded-lg border border-eco-primary/20 cursor-pointer" />
            </div>
            <label className="flex items-center gap-2 font-body text-sm text-eco-ink/70 mt-5">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Đăng công khai
            </label>
          </div>

          <div>
            <label className="block font-body text-sm text-eco-ink/70 mb-2">Ảnh bìa</label>
            <div className="flex items-center gap-4">
              {coverUrl && <img src={coverUrl} alt="Ảnh bìa" className="w-20 h-20 object-cover rounded-xl" />}
              <label className="cursor-pointer inline-flex items-center gap-2 bg-eco-surface hover:bg-eco-primary/10 text-eco-primary font-semibold text-sm px-4 py-2 rounded-full transition">
                <ImageIcon className="w-4 h-4" />{coverUrl ? "Đổi ảnh khác" : "Chọn ảnh"}
                <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm text-eco-ink/70 mb-1">Hiển thị từ ngày (bỏ trống = hiện luôn)</label>
              <input type="date" value={visibleFrom} onChange={(e) => setVisibleFrom(e.target.value)} className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary" />
            </div>
            <div>
              <label className="block font-body text-sm text-eco-ink/70 mb-1">Ẩn kể từ ngày (bỏ trống = không hết hạn)</label>
              <input type="date" value={visibleUntil} onChange={(e) => setVisibleUntil(e.target.value)} className="w-full border border-eco-primary/20 rounded-xl px-4 py-2.5 font-body outline-none focus:border-eco-primary" />
            </div>
          </div>

          <hr className="border-eco-primary/10" />

          <div>
            <p className="font-body text-sm text-eco-ink/70 mb-3">Nội dung bài báo</p>
            <div className="flex flex-col gap-4 mb-4">
              {blocks.map((b) => (
                <div key={b.id} ref={(el) => (blockRefs.current[b.id] = el)} onClick={() => setActiveId(b.id)}>
                  {b.type === "text" && <TextBlock block={b} active={activeId === b.id} onChange={updateBlock} fontOptions={fontOptions} />}
                  {b.type === "table" && <TableBlock block={b} active={activeId === b.id} onChange={updateBlock} />}
                  {b.type === "image" && <ImageBlock block={b} active={activeId === b.id} onChange={updateBlock} />}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => addBlock("text")} className="flex items-center gap-1.5 border border-eco-primary/20 text-eco-primary text-sm font-semibold px-4 py-2 rounded-full hover:bg-eco-primary/5 transition"><Type className="w-4 h-4" /> Thêm đoạn văn</button>
              <button type="button" onClick={() => addBlock("table")} className="flex items-center gap-1.5 border border-eco-primary/20 text-eco-primary text-sm font-semibold px-4 py-2 rounded-full hover:bg-eco-primary/5 transition"><TableIcon className="w-4 h-4" /> Thêm bảng</button>
              <button type="button" onClick={() => addBlock("image")} className="flex items-center gap-1.5 border border-eco-primary/20 text-eco-primary text-sm font-semibold px-4 py-2 rounded-full hover:bg-eco-primary/5 transition"><ImageIcon className="w-4 h-4" /> Thêm ảnh</button>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || !title} className="bg-eco-primary hover:bg-eco-primary-dark disabled:opacity-50 text-white font-semibold py-3 rounded-full transition mt-2">
            {saving ? "Đang lưu..." : "Lưu bài báo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArticleEditor;