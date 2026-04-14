import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CreateCollection({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("idle");

    async function handleCreate() {
        if (!name.trim()) return;

        const { data: { user } } = await supabase.auth.getUser();

        

        if (!user) {
            alert("You must be logged in.");
            return;
        }

        setStatus("creating");

        await supabase.auth.getSession();
        await supabase.auth.refreshSession();

        try {
            console.log("inserting:", {
                name,
                user_id: user.id
            });

            const { data, error } = await supabase
                .from("collections")
                .insert([
                    {
                        name: name,
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error("Supabase error:", error);
                throw error;
            }

            console.log("insert success:", data);

            setStatus("success");

            if (onCreate) onCreate(data);

            setTimeout(() => onClose(), 1000);

        } catch (err) {
            console.error("Create collection error:", err);
            setStatus("error");
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create Collection</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <input
                        type="text"
                        placeholder="Collection Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="modal-footer">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleCreate}>
                        {status === "creating" ? "Creating..." : "Create"}
                    </button>
                </div>

                {status === "success" && <p>Collection created!</p>}
                {status === "error" && <p>Error creating collection.</p>}
            </div>
        </div>
    );
}