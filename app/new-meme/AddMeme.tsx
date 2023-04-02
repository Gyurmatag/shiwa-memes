'use client'

import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { IoIosAttach } from 'react-icons/io'

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
        toast.success('Meme created', { id: toastMemeId })
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
    e.preventDefault()
    if (title && imgFile) {
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
    <form
      onSubmit={submitMeme}
      className="my-8 items-center justify-center rounded-md bg-white p-8"
    >
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
            className="flex cursor-pointer items-center justify-center rounded-md bg-gray-200 p-4 text-lg hover:bg-gray-300"
          >
            {imgFile && imgPreview ? (
              <Image
                src={imgPreview || ''}
                alt="Preview"
                width="300"
                height="300"
                className="mr-2"
              />
            ) : (
              <>
                <IoIosAttach size="20" />
                <span>Browse</span>
              </>
            )}
          </label>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          disabled={isDisabled}
          className="rounded-xl bg-shiwa-purple py-2 px-6 text-sm text-white hover:opacity-90 disabled:opacity-25"
          type="submit"
        >
          Create meme
        </button>
      </div>
    </form>
  )
}
