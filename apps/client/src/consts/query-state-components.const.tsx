import React from 'react';
import { Spinner } from '@nonogram-api-monorepo/ui-kit';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ERROR_TEXT_BASED_ON_EXCEPTION } from './error-text-based-on-exception.const';

export const LoadingState = <Spinner className="size-10" />;

type Props = {
  error: { status?: number | string } | unknown;
};

export const ErrorState: React.FC<Props> = ({ error }) => {
  const navigate = useNavigate();

  const status =
    error && typeof error === 'object' && 'status' in error
      ? (error as { status: number | string }).status
      : undefined;

  if (status === 401) {
    navigate('/', { replace: true });
    return null;
  }

  const message =
    (status && ERROR_TEXT_BASED_ON_EXCEPTION[status]) || 'Something went wrong';

  toast.error(message);

  return <span>😢</span>;
};
