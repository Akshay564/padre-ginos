import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import postContact from "../api/postContact";

export const Route = createLazyFileRoute("/contact")({
  component: () => <Contact />,
});

function Contact() {
  const { mutate, isSuccess } = useMutation({
    mutationFn: ({ name, email, message }) => {
      return postContact(name, email, message);
    },
  });

  return (
    <div className="contact">
      <h2>Contact</h2>
      {isSuccess ? (
        <h3>Submitted</h3>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            mutate({
              name: formData.get("name"),
              email: formData.get("email"),
              message: formData.get("message"),
            });
          }}
        >
          <input name="name" placeholder="Name" required minLength={2} />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
          />
          <textarea
            placeholder="Message"
            name="message"
            required
            minLength={10}
          ></textarea>
          <button>Submit</button>
        </form>
      )}
    </div>
  );
}
