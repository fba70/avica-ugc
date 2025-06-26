import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share"
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"

export const ShareSeenDrop = ({ url }: { url: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {" "}
          <Share />
          SHARE SEENDROP!
        </Button>
      </DialogTrigger>
      <DialogContent className="flex align-center justify-center">
        <DialogHeader>
          <DialogTitle className="text-center">
            SHARE YOUR SEENDROP!
          </DialogTitle>
          <DialogDescription></DialogDescription>
          <Card className="bg-secondary w-[360px] shadow-md">
            <CardContent className="flex flex-row gap-4 align-center justify-center">
              <EmailShareButton url={url}>
                <EmailIcon size={32} round={true} />
              </EmailShareButton>
              <FacebookShareButton url={url}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={32} round={true} />
              </LinkedinShareButton>
              <TelegramShareButton url={url}>
                <TelegramIcon size={32} round={true} />
              </TelegramShareButton>
              <WhatsappShareButton url={url}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
              <TwitterShareButton url={url}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
