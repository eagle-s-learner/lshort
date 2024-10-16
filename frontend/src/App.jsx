import { useState } from "react";

export default function App() {
    const [link, setLink] = useState("");
    const [newLink, setNewLink] = useState("");
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [error, setError] = useState({
        visble: false,
        error: "Something went wrong... Retry!!",
    });
    function handleLink(ev) {
        setLink(ev.target.value);
    }
    async function handleGenerateLink() {
        if (link === "") {
            return;
        }
        try {
            const response = await fetch("http://localhost:8002/api/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: link }),
            });

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            // console.log(result.error);
            // console.log(result);
            setNewLink("http://localhost:8002/api" + "/" + result.id);
        } catch (err) {
            setError(() => {
                return { error: err.message, visble: true };
            });
            setTimeout(() => {
                setError(() => {
                    return { visble: false, error: "Something went wrong" };
                });
            }, 2000);
            // console.log(err.message);
        }
        setLink("");
    }

    async function handleCopy() {
        // console.log(newLink);
        try {
            await navigator.clipboard.writeText(newLink);
            setNotificationVisible(true);
            setTimeout(() => {
                setNotificationVisible(false);
            }, 2000);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <div className="bg-slate-500 text-white w-2/3 text-3xl font-serif p-3 text-center mx-auto font-bold rounded-sm">
                Link Shortner
            </div>
            <div className="flex items-center justify-center mt-1">
                <input
                    value={link}
                    onChange={handleLink}
                    type="text"
                    className="border-2 border-gray-700 p-2 rounded-md"
                    placeholder="Enter the link..."
                />
                <button
                    onClick={handleGenerateLink}
                    className="ml-3 bg-green-300 hover:bg-green-400 text-2xl p-2 rounded-md font-semibold pt-1 flex items-center"
                >
                    Generate
                </button>
            </div>
            {!(newLink === "") && (
                <p className="text-center mt-4">
                    {newLink}{" "}
                    <span
                        onClick={handleCopy}
                        className="underline text-blue-500 cursor-pointer"
                    >
                        Copy Link
                    </span>
                </p>
            )}
            {error.visble && (
                <div className="fixed bottom-5 left-1/3 mx-auto bg-slate-300 text-red-500 py-2 px-4 rounded-md shadow-lg">
                    {error.error}
                </div>
            )}
            {notificationVisible && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg transition-opacity duration-300">
                    Link copied to clipboard!
                </div>
            )}
        </div>
    );
}
