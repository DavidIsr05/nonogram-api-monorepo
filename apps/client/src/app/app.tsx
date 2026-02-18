import { useState, FormEvent, ChangeEvent } from 'react';
import { UserSignInDto } from '../../../../libs/types/src/lib/types';
import { useLoginQuery } from '../store/api';

export const App = () => {
  const [userSignInDto, setUserSignInDto] = useState<UserSignInDto>({
    personalNumber: 0,
    password: '',
  });

  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error, isLoading } = useLoginQuery(userSignInDto, {
    skip: !shouldFetch,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShouldFetch(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSignInDto((prev) => ({
      ...prev,
      [name]: name === 'personalNumber' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={userSignInDto.personalNumber}
          name="personalNumber"
          onChange={handleChange}
          type="number"
        />
        <input
          value={userSignInDto.password}
          name="password"
          onChange={handleChange}
          type="text"
        />
        <button type="submit">Submit</button>
      </form>
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>{data.access_token}</h3>
        </>
      ) : null}
    </div>
  );
};
