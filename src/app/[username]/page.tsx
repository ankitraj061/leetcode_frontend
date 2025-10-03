'use client'
import { useParams } from "next/navigation";

export default function ProfilePage() {
    const params = useParams();
    const username = params.username;

    return (
        <div>
            <h1>Profile Page</h1>
            <p>Username: {username}</p>
        </div>
    );
}