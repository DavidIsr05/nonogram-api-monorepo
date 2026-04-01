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
  useGetUserByIdQuery,
} from '../../../store/api';
import { RootState } from '../../../store/store';
import { toast } from 'sonner';
import { DEFAULT_FORM, DIM_FACTOR_OPTIONS } from '../../../constants';
import { PlusCreate, ImagePlaceholder, Upload } from '../../../assets';
import { ErrorState, LoadingState } from '../../../components';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@nonogram-api-monorepo/ui-kit';

export const CreateNonogramPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [form, setForm] = useState<GenerateNonogramType>(DEFAULT_FORM);

  const [generated, setGenerated] =
    useState<GeneratedNonogramResponseType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = useSelector((state: RootState) => state.user.userId);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isErrorInUserData,
    error: userDataError,
  } = useGetUserByIdQuery(userId!);

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
      isPrivate,
      creatorId: userId,
    });
    handleClose();
  };

  const handleReset = () => {
    setName('');
    setIsPrivate(true);
    setForm(DEFAULT_FORM);
    setGenerated(null);
  };

  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  if (isUserDataLoading) {
    return <LoadingState />;
  }

  if (isErrorInUserData) {
    return <ErrorState error={userDataError} />;
  }

  if (!userData) {
    return;
  }

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hover:scale-110 active:scale-95 transition-transform"
            title="Create your own nonogram!"
          >
            <PlusCreate className="w-[80%] sm:w-full aspect-square" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <span>Create Nonogram</span>
        </TooltipContent>
      </Tooltip>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-absoluteBlack/50 overflow-auto"
          onClick={handleClose}
        >
          <div
            className="bg-absoluteWhite rounded-2xl shadow-2xl p-6 flex flex-col gap-5 w-[25%] h-max-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <div
                className="relative border rounded-xl aspect-square flex items-center justify-center bg-simpleGray cursor-pointer"
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
              <div className="flex flex-col md:flex-row gap-2">
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
              <div className="flex flex-col gap-1">
                <label className="text-sm">Nonogram Name:</label>
                <input
                  className="border rounded-lg px-3 py-1.5 text-sm w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My cat"
                  maxLength={16}
                />
              </div>
              <div className="flex flex-col xl:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label
                    className="text-sm"
                    title="Easy: 20x20; Medium: 30x30; Hard: 40x40"
                  >
                    Difficulty:
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-1.5 text-sm"
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
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label
                    className="text-sm"
                    title="Less value for more pixels."
                  >
                    Pixel Detection Rate:
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-1.5 text-sm"
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
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2">
              {userData.isAdmin && (
                <label className="flex items-center gap-1 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!isPrivate}
                    onChange={(e) => setIsPrivate(!e.target.checked)}
                  />
                  Public
                </label>
              )}
              <div className="flex flex-col lg:flex-row gap-2 ml-auto">
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
        </div>
      )}
    </div>
  );
};
