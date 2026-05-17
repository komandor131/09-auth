"use client";

import { isAxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import css from "./EditProfilePage.module.css";

const EditProfilePage = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [user, setLocalUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadUser = async (): Promise<void> => {
      try {
        const currentUser = await getMe();

        if (!ignore) {
          setLocalUser(currentUser);
          setUsername(currentUser.username);
          setUser(currentUser);
        }
      } catch {
        if (!ignore) {
          router.replace("/sign-in");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      ignore = true;
    };
  }, [router, setUser]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.replace("/profile");
      router.refresh();
    } catch (error) {
      setError(
        isAxiosError(error)
          ? (error.response?.data?.error ?? error.message)
          : "Profile update failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    router.push("/profile");
  };

  if (isLoading || !user) {
    return <p>Loading, please wait...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSubmitting}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p>{error}</p>}
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
