'use client'

import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export default function AddMeme() {
  const [title, setTitle] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const queryClient = useQueryClient()
  let toastMemeId: string

  const { mutate } = useMutation(
    async ({ title, imgUrl }: { title: string; imgUrl: string }) =>
      await axios.post('/api/memes/addMeme', { title, imgUrl }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: toastMemeId })
        }
      },
      onSuccess: (data) => {
        toast.success('Meme has been made', { id: toastMemeId })
        queryClient.invalidateQueries(['memes'])
        setTitle('')
        setImgUrl('')
      },
      onSettled: () => {
        setIsDisabled(false)
      },
    },
  )

  const submitMeme = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDisabled(true)
    mutate({ title, imgUrl })
  }

  return (
    <form onSubmit={submitMeme} className="my-8 rounded-md bg-white p-8">
      <div className="my-4 flex flex-col">
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          value={title}
          placeholder="Meme Title"
          className="my-2 rounded-md bg-gray-200 p-4 text-lg"
        />
        <input
          type="text"
          onChange={(e) => setImgUrl(e.target.value)}
          name="imgUrl"
          value={imgUrl}
          placeholder="Image Url"
          className="my-2 rounded-md bg-gray-200 p-4 text-lg"
        />
      </div>
      <div className="flex">
        <button
          disabled={isDisabled}
          className="rounded-xl bg-teal-600 py-2 px-6 text-sm text-white disabled:opacity-25"
          type="submit"
        >
          Create meme
        </button>
      </div>
    </form>
  )
}
