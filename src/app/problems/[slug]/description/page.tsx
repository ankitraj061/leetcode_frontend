'use client'
import { useSelector, useDispatch } from "react-redux";
export default function ProblemDescriptionPage() {
    const { problem } = useSelector((state: any) => state.problem);
    const {isAuthenticated} = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

    return (
        <div>
            <h1>Problem Description</h1>
            {problem ? (
                <div>
                    <h2>{problem.title}</h2>
                    <p>{problem.description}</p>

                </div>
            ) : (
                <p>No problem found</p>
            )}
        </div>
    );
}