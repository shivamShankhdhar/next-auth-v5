import React, { useState } from "react";
import { CardWrapper } from "./CardWrapper";
import { useCallback, useEffect } from "react";
import { HashLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const NewVerificationForm = () => {
  const [error, setError] = useState<String | undefined>();
  const [success, setSuccess] = useState<String | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch((error) => {
        setError(error);
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backBttonLabel="Back to Login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <div className="flex items-center flex-col gap-6 w-full justify-center">
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        {!error && !success && <HashLoader color="#3b82f6" size={50} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
