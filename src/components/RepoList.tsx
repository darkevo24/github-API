import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import { CircularProgress } from '@mui/material';

export interface Repo{
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
};

export interface Props {
  username: string;
};

function RepoList({ username }: Props) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        let data = response.data;
        console.log(data);
        if (data.length > 3) {
          data = data.slice(0, 3);
        }
        setRepos(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchRepos();
  }, [username]);

  return (
    <>
      {loading ? (
        <CircularProgress className='mt-2' />
      ) : (
        <ul className="mt-4">
          {(repos.length === 0) && (
            <p>The User doesnt has any text.</p>
          )}
          {repos.map((repo) => (
            <div className='bg-gray-200 h-28 relative my-4 p-2'>
              <div className='flex items-center'>
                <p className='font-bold text-lg'>{repo.name}</p>
                <p className='text-sm absolute right-0 p-2 flex items-center'><span className='ml-2'>{repo.stargazers_count}</span> <StarIcon sx={{ fontSize:"medium" }} /></p>
              </div>
              <p>{repo.description}</p>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}

export default RepoList;
