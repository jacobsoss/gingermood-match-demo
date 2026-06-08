"use client";

import { useState } from "react";
import type { Answer, Chip, Question } from "@/lib/types";
import { COPY } from "@/lib/copy";
import { ProgressBar } from "@/components/ProgressBar";
import { CitySearch } from "@/components/CitySearch";
import { DictationField } from "@/components/DictationField";

function sameChip(a: Chip, b: Chip) {
  return a.label === b.label;
}

export function QuestionScreen({
  question,
  initialAnswer,
  index,
  total,
  onAnswer,
  onBack,
  canGoBack,
  busy = false,
}: {
  question: Question;
  initialAnswer?: Answer;
  index: number;
  total: number;
  onAnswer: (answer: Answer) => void;
  onBack: () => void;
  canGoBack: boolean;
  busy?: boolean;
}) {
  const [selected, setSelected] = useState<Chip[]>(initialAnswer?.selectedChips ?? []);
  const [text, setText] = useState(initialAnswer?.text ?? "");
  const isSingle = question.kind === "single";

  function toggleChip(chip: Chip) {
    setSelected((prev) => {
      const exists = prev.some((c) => sameChip(c, chip));
      if (isSingle) return exists ? [] : [chip];
      return exists ? prev.filter((c) => !sameChip(c, chip)) : [...prev, chip];
    });
  }

  const canContinue = selected.length > 0 || text.trim().length > 0;

  function submit() {
    if (!canContinue) return;
    onAnswer({
      questionId: question.id,
      prompt: question.prompt,
      dimensionProbed: question.dimensionProbed,
      text: text.trim(),
      selectedChips: selected,
    });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-var(--nav-h))] w-full max-w-[640px] flex-col px-6 py-7 sm:px-8">
      <div className="mt-1">
        <ProgressBar current={index} total={total} />
      </div>

      {/* Question body — keyed by id so it re-animates (12px slide + fade) */}
      <div key={question.id} className="gm-rise mt-10 flex flex-1 flex-col">
        {question.dimensionProbed && (
          <p className="text-[15px] italic text-muted">{question.dimensionProbed}</p>
        )}
        <h2 className="mt-2 font-display text-[28px] font-semibold text-ink">{question.prompt}</h2>
        {question.helper && (
          <p className="mt-3 text-[17px] leading-relaxed text-muted">{question.helper}</p>
        )}

        {question.widget === "city" ? (
          <CitySearch value={text} onChange={setText} onEnter={submit} />
        ) : (
          question.allowCustom && (
            <DictationField
              value={text}
              onChange={setText}
              placeholder={COPY.question.openPlaceholder}
            />
          )
        )}

        {question.chips.length > 0 && (
          <>
            <p className="mt-6 mb-3 text-[15px] text-muted">
              {isSingle ? COPY.question.chipsHintSingle : COPY.question.chipsHintMulti}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {question.chips.map((chip) => {
                const active = selected.some((c) => sameChip(c, chip));
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    aria-pressed={active}
                    className={`gm-focus min-h-[44px] rounded-full px-5 text-[15px] font-semibold transition-colors active:scale-[0.98] ${
                      active
                        ? "bg-purple text-white"
                        : "bg-wash text-purple-700 hover:bg-tint"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="flex-1" />

        {/* Actions: back as text link (left), one primary button (bottom-right) */}
        <div className="sticky bottom-0 -mx-6 mt-8 flex items-center justify-between gap-4 bg-page px-6 pb-2 pt-5 sm:-mx-8 sm:px-8">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={busy}
              className="gm-focus rounded-sm text-[17px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline disabled:opacity-40"
            >
              {COPY.question.back}
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!canContinue || busy}
            className="gm-focus inline-flex min-h-[52px] items-center justify-center rounded-full bg-orange px-8 text-[17px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-ink" />
                {COPY.question.thinking}
              </span>
            ) : (
              COPY.question.continue
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
