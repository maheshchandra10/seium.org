import { withoutAuth } from "@context/Auth";
import Navbar from "@components/website/utils/Navbar";
import Footer from "@components/website/utils/Footer";
import Faqs from "@components/website/faqs";

function Faq() {
  return (
    <Navbar bgColor="primary" button={"quinary"} fgColor={"white"}>
      <Faqs />
      <Footer color="primary" />
    </Navbar>
  );
}

export default withoutAuth(Faq);
