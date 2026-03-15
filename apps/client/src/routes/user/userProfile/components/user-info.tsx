import { ExceptionType, UpdateUserType } from '@nonogram-api-monorepo/types';
import { HTTP_ERROR_MESSAGES } from '../../../../constants';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateUserMutation } from '../../../../store/api';

type Props = UpdateUserType & { personalNumber: number };

export const UserInfo: React.FC<Props> = ({ id, username, personalNumber }) => {
  const [editUserDto, setEditUserDto] = useState<UpdateUserType>({
    id,
    username,
    password: '        ',
  });

  const [updateUser] = useUpdateUserMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUserDto((prev) => ({
      ...prev,
      [name]: name === 'password' && value.trim() === '' ? '' : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let editUserDtoEditedFields: UpdateUserType = {
      id,
    };

    if (editUserDto.username && editUserDto.username.trim() !== '') {
      editUserDtoEditedFields = {
        ...editUserDtoEditedFields,
        username: editUserDto.username,
      };
    }

    if (editUserDto.password && editUserDto.password.trim() !== '') {
      editUserDtoEditedFields = {
        ...editUserDtoEditedFields,
        password: editUserDto.password,
      };
    }

    try {
      const result = await updateUser(editUserDtoEditedFields).unwrap();

      if (result) {
        toast.info('Updated info');
      }
    } catch (error) {
      const e = error as ExceptionType;

      if (HTTP_ERROR_MESSAGES[e.status]) {
        toast.error(HTTP_ERROR_MESSAGES[e.status]);
      } else {
        toast.error('error acuared while updating useer information');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-[50%] h-[80%] border-r border-r-absoluteBlack">
      <span className="text-xl">Update user info:</span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[2.5rem] items-center w-full"
      >
        <input
          value={personalNumber}
          name="personalNumber"
          type="text"
          className="rounded-lg border border-absoluteBlack w-[40%] h-9 p-3"
          disabled={true}
        />
        <input
          value={editUserDto.username}
          name="username"
          onChange={handleChange}
          type="text"
          placeholder="Username:"
          className="rounded-lg border border-absoluteBlack w-[40%] h-9 p-3"
        />
        <input
          value={editUserDto.password}
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password:"
          className="rounded-lg border border-absoluteBlack w-[40%] h-9 p-3"
        />
        <button
          type="submit"
          className="bg-signupPageOrange w-[10%] h-9 border border-absoluteBlack rounded-lg text-base"
        >
          Update
        </button>
      </form>
    </div>
  );
};
