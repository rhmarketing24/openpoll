export default {
  name: "OpenPoll",
  slug: "openpoll",
  description: "Create and share polls on Base",
  icon: "/icons/icon.png",
  author: "Your Name",
  homepage: process.env.NEXT_PUBLIC_APP_URL || "",
  permissions: [],
  accountAssociation: {
    domain: process.env.NEXT_PUBLIC_APP_URL || "",
    address: ""
  }
};
