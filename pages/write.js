import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import baseUrl from '../helpers/baseUrl'
import { useRouter } from 'next/router'
import Main from '../components/layout/main/Main';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import Editor from '../components/editor/Editor';

export default function Write() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [media, setMedia] = useState("")
    const [loading, setLoading] = useState(false)

    const notify = (type, text) => {
        if (type == 1) {
            toast.success(text)
        }
        else {
            toast.error(text)
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        const mediaUrl = await imageUpload()
        try {
            const res = await Axios.post(`${baseUrl}/api/blogs`, {
                title,
                author,
                content,
                mediaUrl,
            })
            const res2 = res.data
            if (res2.err) {
                notify(0, res2.err)
                setLoading(false)
            } else {
                setLoading(false)
                router.push('/')
                notify(1, 'Blog successfully Published :)')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const imageUpload = async () => {
        if (!media) {
            return ''
        }
        const data = new FormData()
        data.append('file', media)
        data.append('upload_preset', 'nextjsBlog')
        data.append('cloud_name', "ashish124")
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/ashish124/image/upload`, {
                method: "POST",
                body: data
            })
            const res2 = await res.json()
            return res2.url
        } catch (error) {
            console.log(error)
            return ''
        }
    }

    return (
        <Main>
            <Toaster />
            <form action="" className="form" onSubmit={handleSubmit}>
                <h2>Write the blog! </h2>
                <br />
                <span>Title</span>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <span>Author</span>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                <span>Cover Photo</span>
                <input type="file"
                    accept="image/*"
                    onChange={(e) => setMedia(e.target.files[0])} />
                {media &&
                    <Image src={URL.createObjectURL(media)} className="responsive-img" alt="img" width={700} height={400} />
                }
                <div>
                    <Editor content={content} setContent={setContent} />
                </div>

                <button style={{ marginTop: "2rem" }} type="submit" disabled={loading}>{loading ? "Publishing..." : "Publish"}</button>
            </form>
        </Main>
    )
}
