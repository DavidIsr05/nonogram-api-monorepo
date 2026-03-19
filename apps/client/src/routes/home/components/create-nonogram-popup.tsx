import {
  NonogramDifficulties,
  NonogramDifficultiesEnumType,
  GenerateNonogramType,
  GeneratedNonogramResponseType,
} from '@nonogram-api-monorepo/types';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useCreateNonogramMutation,
  useGenerateNonogramMutation,
} from '../../../store/api';
import { RootState } from '../../../store/store';
import { toast } from 'sonner';
import { DEFAULT_FORM, DIM_FACTOR_OPTIONS } from '../../../constants';
import { PlusCreate, ImagePlaceholder, Upload } from '../../../assets';

export const CreateNonogramPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [form, setForm] = useState<GenerateNonogramType>(DEFAULT_FORM);

  const [generated, setGenerated] =
    useState<GeneratedNonogramResponseType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = useSelector((state: RootState) => state.user.userId);

  const [triggerGenerate, { isLoading: isGenerating }] =
    useGenerateNonogramMutation();
  const [triggerCreate, { isLoading: isCreating }] =
    useCreateNonogramMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error('Please upload a file');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setForm((prev) => ({ ...prev, imageBase64: base64 }));
      setGenerated(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!form.imageBase64) {
      toast.error('No image was uploadd');
      return;
    }

    const result = await triggerGenerate(form);
    if (result.data) {
      setGenerated(result.data);
    }
  };

  const handleCreate = async () => {
    if (!generated || !userId) {
      toast.error('error while creating nonogram');
      return;
    }
    await triggerCreate({
      ...generated,
      nonogram: generated.nonogram as string,
      name,
      isPrivate: true,
      creatorId: userId,
    });
    handleClose();
  };

  const handleReset = () => {
    setName('');
    setForm(DEFAULT_FORM);
    setGenerated(null);
  };

  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:scale-105 active:scale-95 transition-transform"
      >
        <PlusCreate className="w-[3rem] aspect-square" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-absoluteBlack/50"
          onClick={handleClose}
        >
          <div
            className="bg-absoluteWhite rounded-2xl shadow-2xl p-6 flex flex-col gap-5 w-[25%]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <div
                className="relative border rounded-xl aspect-square flex items-center justify-center bg-simpleGray cursor-pointer overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {form.imageBase64 ? (
                  <img
                    src={`data:image/png;base64,${form.imageBase64}`}
                    alt="uploaded"
                    className="w-full h-full"
                  />
                ) : (
                  <ImagePlaceholder className="w-16 h-16" />
                )}
                {generated && (
                  <img
                    src={`data:image/png;base64,${generated.previewImageBase64}`}
                    alt="preview"
                    className="absolute w-full h-full"
                  />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1 border rounded-lg py-1.5 text-sm text-prettyGray hover:bg-simpleGray hover:scale-105 active:scale-95 transition-transform"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                <button
                  type="button"
                  disabled={!form.imageBase64 || isGenerating}
                  onClick={handleGenerate}
                  className="flex-1 border rounded-lg py-1.5 text-sm text-prettyGray hover:bg-simpleGray hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Preview'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <input
                className="border rounded-lg px-3 py-1.5 text-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nonogram name:"
              />
              <div className="flex gap-3">
                <select
                  className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                  value={form.difficulty}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      difficulty: e.target
                        .value as NonogramDifficultiesEnumType,
                    }));
                    setGenerated(null);
                  }}
                >
                  {Object.values(NonogramDifficulties).map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>

                <select
                  className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                  value={form.mainObjectDimFactor}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      mainObjectDimFactor: +e.target.value,
                    }));
                    setGenerated(null);
                  }}
                >
                  {DIM_FACTOR_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 border rounded-lg text-sm hover:bg-simpleGray hover:scale-105 active:scale-95 transition-transform"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={!generated || !name || isCreating}
                onClick={handleCreate}
                className="px-5 py-2 bg-buttonGreen text-absoluteWhite rounded-lg text-sm hover:bg-buttonHoverGreen hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
