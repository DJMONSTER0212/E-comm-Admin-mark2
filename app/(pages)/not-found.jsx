// import { Button } from "@/components/ui/button"
import { Button } from '../_components/ui/button';
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button>Click me</Button>
      <Link href="/">Return Home</Link>
    </div>
  )
}

