'use client'

import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export default function AddMeme() {
  const [title, setTitle] = useState('')
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const queryClient = useQueryClient()
  let toastMemeId: string

  const { mutate } = useMutation(
    async ({ title, imgFile }: { title: string; imgFile: File }) => {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('imgFile', imgFile)
      return await axios.post('/api/memes/addMeme', formData)
    },
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
        setImgFile(null)
        setImgPreview(null)
      },
      onSettled: () => {
        setIsDisabled(false)
      },
    },
  )

  const submitMeme = async (e: React.FormEvent) => {
    if (title && imgFile) {
      e.preventDefault()
      setIsDisabled(true)
      mutate({ title, imgFile })
    }
  }

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImgFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImgPreview(reader.result?.toString() || null)
      }
      reader.readAsDataURL(file)
    } else {
      setImgFile(null)
      setImgPreview(null)
    }
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
        <div className="my-2">
          <input
            type="file"
            onChange={handleImgChange}
            name="image"
            accept="image/*"
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer items-center justify-center rounded-md bg-gray-200 p-4 text-lg"
          >
            {imgFile ? (
              <img src={imgPreview || ''} alt="Preview" className="mr-2 h-52" />
            ) : (
              'Browse'
            )}
          </label>
        </div>
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
