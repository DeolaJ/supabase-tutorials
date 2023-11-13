import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import supabase from "../lib/supabase";

function cleanInput(value) {
    return `${value}`.replace(/[<>%$]/gi, "");
}

function ContactForm() {
    const defaultContact = {
        name: "",
        email: "",
        body: "",
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [feeback, setFeedback] = useState("");

    const ContactSchema = Yup.object().shape({
        name: Yup.string().max(140, "Too long!").required("Required."),
        email: Yup.string().email("Invalid email.").max(140, "Too long!").required("Required."),
        body: Yup.string().max(280, "Too long!").required("Required."),
    });

    async function handleSubmit(values, { resetForm }) {
        setIsSubmitting(true);
        const { name, email, body } = values;
        try {
            const { error } = await supabase.from("contacts").insert({ name, email, body });
            if (error) {
                throw error;
            }
            setFeedback("Form submitted successfully");
            setIsSuccessful(true);
            resetForm();
        } catch (error) {
            console.log("Error occurred", { error });
            setFeedback("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (feeback) {
            setTimeout(() => setFeedback(""), 3000);
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

            {!isSuccessful && (
                <Formik
                    enableReinitialize
                    initialValues={defaultContact}
                    validationSchema={ContactSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <Field name="name">
                                {({ field, meta }) => (
                                    <div className="form-control">
                                        <label mb="1.5" fontSize="sm" htmlFor="contact-name">
                                            Name
                                        </label>
                                        <input
                                            {...field}
                                            placeholder="Enter name"
                                            id="contact-name"
                                            onChange={(e) => {
                                                const value = cleanInput(e.target.value);
                                                setFieldValue("name", value);
                                            }}
                                        />
                                        {meta.error && meta.touched && <p>{meta.error}</p>}
                                    </div>
                                )}
                            </Field>
                            <Field name="email">
                                {({ field, meta }) => (
                                    <div className="form-control">
                                        <label mb="1.5" fontSize="sm" htmlFor="contact-email">
                                            Email address{" "}
                                            <span className="help-text">
                                                (A test email notification will be sent to this
                                                email)
                                            </span>
                                        </label>
                                        <input
                                            {...field}
                                            placeholder="Enter email"
                                            id="contact-email"
                                            onChange={(e) => {
                                                const value = cleanInput(e.target.value);
                                                setFieldValue("email", value);
                                            }}
                                        />

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
                                            onChange={(e) => {
                                                const value = cleanInput(e.target.value);
                                                setFieldValue("body", value);
                                            }}
                                        />
                                        {meta.error && meta.touched && <p>{meta.error}</p>}
                                    </div>
                                )}
                            </Field>

                            <div className="button-container">
                                <button type="submit" className="submit-button">
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </section>
    );
}

export default ContactForm;
