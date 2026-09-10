"use client";

import { useState } from "react";
import { btnPrimary, btnLink } from "@/lib/platform/ui-classes";
import { useCopy } from "./LanguageProvider";
import { IconCheck } from "./icons";

const inputCls =
  "gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted";
const labelCls = "mb-1.5 block text-[14px] font-medium text-ink";

type Fields = { org: string; name: string; email: string; size: string; message: string };
const EMPTY: Fields = { org: "", name: "", email: "", size: "", message: "" };

/**
 * Employer sales enquiry — a DEMO interaction. On "submit" it shows what would be
 * received; it never claims a message was sent and stores nothing (§3, §8).
 */
export function EnquiryForm() {
  const c = useCopy().enquiry;
  const [f, setF] = useState<Fields>(EMPTY);
  const [previewed, setPreviewed] = useState(false);
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const canSubmit = f.org.trim() && f.name.trim() && /^\S+@\S+\.\S+$/.test(f.email.trim());

  if (previewed) {
    return (
      <div className="gm-rise rounded-[var(--radius-card)] border border-hair bg-surface p-6 sm:p-7">
        <p className="flex items-center gap-2 text-[14px] font-medium text-purple">
          <IconCheck size={16} />
          {c.previewTitle}
        </p>
        <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-hair pt-4 sm:grid-cols-[auto_1fr]">
          {[
            [c.orgLabel, f.org],
            [c.nameLabel, f.name],
            [c.emailLabel, f.email],
            [c.sizeLabel, f.size || "—"],
            [c.messageLabel, f.message || "—"],
          ].map(([k, v]) => (
            <div key={k} className="sm:contents">
              <dt className="text-[13px] font-medium uppercase tracking-[0.06em] text-muted">{k}</dt>
              <dd className="text-[15px] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 rounded-[var(--radius-input)] bg-wash px-4 py-3 text-[13px] leading-relaxed text-muted">
          {c.previewNote}
        </p>
        <button type="button" onClick={() => setPreviewed(false)} className={`${btnLink} mt-4`}>
          {c.reset}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) setPreviewed(true);
      }}
      noValidate
      className="rounded-[var(--radius-card)] border border-hair bg-surface p-6 sm:p-7"
    >
      <p className="mb-4 inline-flex rounded-full bg-wash px-3 py-1 text-[12px] font-medium text-muted">
        {c.demoBanner}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="eq-org" className={labelCls}>{c.orgLabel}</label>
          <input id="eq-org" className={inputCls} value={f.org} onChange={set("org")} placeholder="Nova Health Group" />
        </div>
        <div>
          <label htmlFor="eq-name" className={labelCls}>{c.nameLabel}</label>
          <input id="eq-name" className={inputCls} value={f.name} onChange={set("name")} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="eq-email" className={labelCls}>{c.emailLabel}</label>
          <input id="eq-email" type="email" className={inputCls} value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@company.nl" />
        </div>
        <div>
          <label htmlFor="eq-size" className={labelCls}>{c.sizeLabel}</label>
          <input id="eq-size" className={inputCls} value={f.size} onChange={set("size")} placeholder="e.g. 250" inputMode="numeric" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="eq-msg" className={labelCls}>{c.messageLabel}</label>
          <textarea id="eq-msg" rows={3} className={`${inputCls} resize-none`} value={f.message} onChange={set("message")} />
        </div>
      </div>
      <button type="submit" disabled={!canSubmit} className={`${btnPrimary} mt-5`}>
        {c.submit}
      </button>
    </form>
  );
}
