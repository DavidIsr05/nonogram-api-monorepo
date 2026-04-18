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
import { PlusCreate, ImagePlaceholder, Upload, Info } from '../../../assets';
import { ErrorState, LoadingState } from '../../../components';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@nonogram-api-monorepo/ui-kit';

export const CreateNonogramPopup: React.FC = () => {
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
    handleReset();
  };

  const handleReset = () => {
    setName('');
    setIsPrivate(true);
    setForm(DEFAULT_FORM);
    setGenerated(null);
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

  const handleDifficultyChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      difficulty: value as NonogramDifficultiesEnumType,
    }));
    setGenerated(null);
  };

  const handlePDRChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      mainObjectDimFactor: parseFloat(value),
    }));
    setGenerated(null);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="hover:scale-110 active:scale-95 transition-transform"
            >
              <PlusCreate className="w-[80%] sm:w-full aspect-square" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>Create Nonogram</span>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-absoluteWhite rounded-2xl shadow-2xl p-4 flex flex-col gap-5 w-[35%] h-max-[90%]"
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
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1 border rounded-lg py-1.5 text-sm text-prettyGray hover:bg-simpleGray hover:scale-105 active:scale-95 transition-transform"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </Button>
            <Button
              type="button"
              disabled={!form.imageBase64 || isGenerating}
              onClick={handleGenerate}
              className="flex-1 border rounded-lg py-1.5 text-sm text-prettyGray hover:bg-simpleGray hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Preview'}
            </Button>
          </div>
        </div>

        <FieldGroup className="flex flex-col gap-2">
          <Field className="flex flex-col gap-1">
            <FieldLabel className="text-sm">Nonogram Name:</FieldLabel>
            <Input
              className="border rounded-lg px-3 py-1.5 text-sm w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My cat"
              maxLength={16}
            />
          </Field>
          <FieldGroup className="flex flex-col xl:flex-row gap-3">
            <Field className="flex-1 flex flex-col gap-1">
              <div className="flex flex-row gap-2">
                <FieldLabel
                  className="text-sm"
                  title="Easy: 20x20; Medium: 30x30; Hard: 40x40"
                >
                  Difficulty:
                </FieldLabel>
                <Tooltip>
                  <TooltipTrigger>
                    <Info />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      Easy: 20x20
                      <br />
                      Medium: 30x30
                      <br />
                      Hard: 40x40
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                onValueChange={handleDifficultyChange}
                value={form.difficulty}
              >
                <SelectTrigger
                  className="w-full border rounded-lg px-3 py-1.5 text-sm"
                  value={form.difficulty}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-absoluteWhite">
                  {Object.values(NonogramDifficulties).map((difficulty) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={difficulty}
                      value={difficulty}
                    >
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field className="flex-1 flex flex-col gap-1">
              <div className="flex flex-row gap-2">
                <FieldLabel className="text-sm">
                  Pixel Detection Rate:
                </FieldLabel>
                <Tooltip>
                  <TooltipTrigger>
                    <Info />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      Sensitivity of pixel detection. Lower values detect more
                      pixels, higher values detect fewer.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                onValueChange={handlePDRChange}
                value={String(form.mainObjectDimFactor)}
              >
                <SelectTrigger
                  className="w-full border rounded-lg px-3 py-1.5 text-sm"
                  value={form.mainObjectDimFactor}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-absoluteWhite">
                  {DIM_FACTOR_OPTIONS.map((value) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={value}
                      value={String(value)}
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldGroup>

        <DialogFooter>
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
              <Button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 border rounded-lg text-sm hover:bg-simpleGray hover:scale-105 active:scale-95 transition-transform"
              >
                Reset
              </Button>
              <DialogClose>
                <Button
                  type="button"
                  disabled={!generated || !name || isCreating}
                  onClick={handleCreate}
                  className="px-5 py-2 bg-buttonGreen text-absoluteWhite rounded-lg text-sm hover:bg-buttonHoverGreen hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Submit'}
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
