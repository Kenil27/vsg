"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Firestore } from "firebase/firestore";
import {
  fetchSevakNameList,
  saveSevakNameList,
} from "@/lib/firestore/sevak";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type SevakNamesEditorProps = {
  db: Firestore;
  /** Called after a successful save so other panels can reload Firestore data. */
  onSaved?: () => void;
  /** When set, shows a control to hide the editor (e.g. collapses in parent). */
  onClose?: () => void;
};

export function SevakNamesEditor({ db, onSaved, onClose }: SevakNamesEditorProps) {
  const [baseline, setBaseline] = useState<string[]>([]);
  const [draft, setDraft] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [editingSelection, setEditingSelection] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [newName, setNewName] = useState("");

  const load = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const list = await fetchSevakNameList(db);
      setBaseline(list);
      setDraft(list);
    } catch {
      setLoadError(
        "Could not load sevak names. Check Firestore rules for read access to sevak/names.",
      );
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selectedName && !draft.includes(selectedName)) {
      setSelectedName(null);
      setEditingSelection(false);
      setEditValue("");
    }
  }, [draft, selectedName]);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(baseline),
    [draft, baseline],
  );

  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return draft.filter((n) => n.toLowerCase().includes(q));
  }, [draft, searchQuery]);

  const resetSearchUi = useCallback(() => {
    setSearchQuery("");
    setSelectedName(null);
    setEditingSelection(false);
    setEditValue("");
  }, []);

  const selectName = (name: string) => {
    setSelectedName(name);
    setEditingSelection(false);
    setEditValue(name);
    setSaveError(null);
  };

  const startEditSelection = () => {
    if (!selectedName) return;
    setEditingSelection(true);
    setEditValue(selectedName);
    setSaveError(null);
  };

  const cancelEditSelection = () => {
    setEditingSelection(false);
    setEditValue(selectedName ?? "");
    setSaveError(null);
  };

  const commitEditSelection = () => {
    if (!selectedName) return;
    const next = editValue.trim();
    if (!next) {
      setSaveError("Name cannot be empty.");
      return;
    }
    const others = draft.filter((n) => n !== selectedName);
    if (others.includes(next)) {
      setSaveError("That name already exists in the list.");
      return;
    }
    setDraft((prev) => prev.map((n) => (n === selectedName ? next : n)));
    setSaveError(null);
    resetSearchUi();
  };

  const removeSelected = () => {
    if (!selectedName) return;
    setDraft((prev) => prev.filter((n) => n !== selectedName));
    setSaveError(null);
    resetSearchUi();
  };

  const addName = (e?: FormEvent) => {
    e?.preventDefault();
    const next = newName.trim();
    if (!next) return;
    if (draft.includes(next)) {
      setSaveError("That name is already in the list.");
      return;
    }
    setDraft((prev) => [...prev, next]);
    setNewName("");
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      await saveSevakNameList(db, draft);
      const list = await fetchSevakNameList(db);
      setBaseline(list);
      setDraft(list);
      if (selectedName && !list.includes(selectedName)) {
        setSelectedName(null);
        setEditingSelection(false);
      }
      onSaved?.();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Save failed. Check Firestore rules allow writes to sevak/names.";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraft(baseline);
    setSelectedName(null);
    setEditingSelection(false);
    setEditValue("");
    setSaveError(null);
    setNewName("");
    setSearchQuery("");
  };

  return (
    <Card title={onClose ? undefined : "Sevak names"}>
      {onClose ? (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Sevak names
          </h2>
          <Button
            type="button"
            variant="secondary"
            className="self-start sm:self-auto"
            onClick={onClose}
          >
            Hide
          </Button>
        </div>
      ) : null}
      {loading ? (
        <p className="text-sm text-zinc-500">Loading names…</p>
      ) : null}
      {loadError ? (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {loadError}
        </p>
      ) : null}

      {!loading && !loadError ? (
        <>
          <div className="mb-6 border-b border-zinc-200 pb-6 dark:border-zinc-700">
            <Field
              id="sevak-search"
              label="Search to edit or delete"
              hint="Type part of a name, then pick a row below."
            >
              <Input
                id="sevak-search"
                type="search"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sevak names…"
              />
            </Field>

            <div className="mt-2">
              {!searchQuery.trim() ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {draft.length === 0
                    ? "No names yet. Add one in the section below."
                    : ""}
                </p>
              ) : searchMatches.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No names match &ldquo;{searchQuery.trim()}&rdquo;.
                </p>
              ) : (
                <ul
                  className="max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/80"
                  role="listbox"
                  aria-label="Search results"
                >
                  {searchMatches.map((name) => {
                    const isSelected = selectedName === name;
                    return (
                      <li key={name} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => selectName(name)}
                          className={`flex w-full items-center px-3 py-2.5 text-left text-sm transition ${
                            isSelected
                              ? "bg-emerald-100 font-medium text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-50"
                              : "text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {selectedName ? (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Selected
                </p>
                {editingSelection ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                      id="sevak-edit-selected"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="sm:max-w-md"
                      autoFocus
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" onClick={commitEditSelection}>
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={cancelEditSelection}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedName}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={startEditSelection}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        onClick={removeSelected}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={addName}
            className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end"
          >
            <div className="min-w-0 flex-1">
              <Field id="new-sevak-name" label="Add new entry">
                <Input
                  id="new-sevak-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New sevak name"
                />
              </Field>
            </div>
            <Button type="submit" variant="secondary" className="shrink-0">
              Add
            </Button>
          </form>

          {saveError ? (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
              {saveError}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={!dirty || saving}
              onClick={() => void handleSave()}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={!dirty || saving}
              onClick={handleDiscard}
            >
              Discard
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() => void load()}
            >
              Reload
            </Button>
          </div>
        </>
      ) : null}
    </Card>
  );
}
