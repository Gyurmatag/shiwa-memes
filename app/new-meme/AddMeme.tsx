'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { IoIosAttach } from 'react-icons/io'
import { useRouter } from 'next/navigation'

const postMeme = async ({
  title,
  imgFile,
}: {
  title: string
  imgFile: File
}) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('imgFile', imgFile)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/memes/addMeme`,
    {
      method: 'POST',
      body: formData,
    },
  )
  if (response.ok) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`,
    )
    return response.json()
  }
  return response.json().then((text) => {
    throw new Error(text.message)
  })
}

export default function AddMeme() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  let toastMemeId: string

  const submitMeme = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title && imgFile) {
      setIsDisabled(true)
      try {
        await postMeme({ title, imgFile })
        toast.success('Meme created', { id: toastMemeId })
        setTitle('')
        setImgFile(null)
        setImgPreview(null)
        // TODO: workaround solution until the Next.js team doesn't handle server side caching well
        // https://beta.nextjs.org/docs/routing/linking-and-navigating#invalidating-the-cache
        router.refresh()
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong', {
          id: toastMemeId,
        })
      }
      setIsDisabled(false)
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
      className="my-8 items-center justify-center rounded-md bg-gray-50 p-8 dark:bg-gray-700"
    >
      <div className="my-4 flex flex-col">
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          value={title}
          placeholder="Meme Title"
          className="my-2 rounded-md bg-gray-200 p-4 text-lg dark:bg-gray-500"
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
            className="flex cursor-pointer items-center justify-center rounded-md bg-gray-200 p-4 text-lg hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
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
          className="rounded-xl bg-shiwa-purple px-6 py-2 text-sm text-white hover:opacity-90 disabled:opacity-25 dark:bg-gray-500 dark:hover:opacity-80"
          type="submit"
        >
          Create meme
        </button>
      </div>
    </form>
  )
}
