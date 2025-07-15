interface EmailTemplateProps {
  userName: string
  email: string
  message: string
}

export function EmailTemplate({
  userName,
  email,
  message,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>AVICA MYFLIX message from: {userName}</h1>
      <h1>Email address: {email}</h1>
      <h2>Message: {message}!</h2>
    </div>
  )
}
