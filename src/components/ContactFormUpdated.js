import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import useUpdateContacts from "../hooks/useUpdateContacts";

function ContactForm() {
    const defaultContact = {
        name: "",
        email: "",
        body: "",
    };

    const [feeback, setFeedback] = useState("");
    const { mutateAsync: submitFormAsync, isLoading: isSubmittingForm } = useUpdateContacts();

    const ContactSchema = Yup.object().shape({
        name: Yup.string().max(140, "Too long!").required("Required."),
        email: Yup.string().email("Invalid email.").max(140, "Too long!").required("Required."),
        body: Yup.string().max(280, "Too long!").required("Required."),
    });

    async function handleSubmit(values, { resetForm }) {
        const { name, email, body } = values;
        try {
            await submitFormAsync({ name, email, body });
            setFeedback("Form submitted successfully");
            resetForm();
        } catch (error) {
            console.log("Error occurred", { error });
            setFeedback("An error occurred");
        }
    }

    useEffect(() => {
        if (feeback) {
            setTimeout(() => setFeedback(""), 2000);
        }
    }, [feeback]);

    return (
        <section className="form-container">
            <h2>Contact form</h2>

            {feeback && (
                <div className="feedback">
                    <p>{feeback}</p>
                </div>
            )}

            <Formik
                enableReinitialize
                initialValues={defaultContact}
                validationSchema={ContactSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <Field name="name">
                        {({ field, meta }) => (
                            <div className="form-control">
                                <label mb="1.5" fontSize="sm" htmlFor="contact-name">
                                    Name
                                </label>
                                <input {...field} placeholder="Enter name" id="contact-name" />
                                {meta.error && meta.touched && <p>{meta.error}</p>}
                            </div>
                        )}
                    </Field>
                    <Field name="email">
                        {({ field, meta }) => (
                            <div className="form-control">
                                <label mb="1.5" fontSize="sm" htmlFor="contact-email">
                                    Email
                                </label>
                                <input {...field} placeholder="Enter email" id="contact-email" />
                                {meta.error && meta.touched && <p>{meta.error}</p>}
                            </div>
                        )}
                    </Field>
                    <Field name="body">
                        {({ field, meta }) => (
                            <div className="form-control">
                                <label mb="1.5" fontSize="sm" htmlFor="contact-body">
                                    Body
                                </label>
                                <textarea
                                    {...field}
                                    id="contact-body"
                                    placeholder="Describe what you are reaching out for."
                                />
                                {meta.error && meta.touched && <p>{meta.error}</p>}
                            </div>
                        )}
                    </Field>

                    <div className="button-container">
                        <button type="submit" className="submit-button">
                            {isSubmittingForm ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </Form>
            </Formik>
        </section>
    );
}

export default ContactForm;
