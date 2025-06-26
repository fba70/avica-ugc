"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImagePlus, User, X } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import type { CloudinaryUploadWidgetResults } from "next-cloudinary"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string
}

const AvatarImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    if (typeof result.info === "object" && "secure_url" in result.info) {
      // onChange([...value, result.info.secure_url]);
      onChange(result.info.secure_url)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="flex items-center mb-4 gap-4">
        <div className="relative w-[380px] h-[380px] rounded-md">
          <div className="z-10 absolute top-0 -right-2">
            <Button
              type="button"
              onClick={() => onRemove(value)}
              variant="secondary"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {value ? (
            <div className="relative h-[350px] w-[350px]">
              <Image
                className="object-cover object-center"
                alt="Image"
                src={value}
                fill
                priority
              />
            </div>
          ) : (
            <User className="w-[370px] h-[370px] bg-slate-500" />
          )}
        </div>
      </div>

      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="ecommerce"
        options={{
          multiple: false,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload image
            </Button>
          )
        }}
      </CldUploadWidget>
    </>
  )
}

export default AvatarImageUpload
