import {
  GenerateNonogramDto,
  NonogramDifficulties,
} from '@nonogram-api-monorepo/types';

export const DEFAULT_FORM: GenerateNonogramDto = {
  difficulty: NonogramDifficulties.MEDIUM,
  mainObjectDimFactor: 0.3,
  imageBase64: '',
  previewImageIntRGB: 0,
};
