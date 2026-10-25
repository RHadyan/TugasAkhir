import "../../../../programs/japan/ppbj/globals.css";

export default function LocalizedPPBJLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-screen bg-white">{children}</div>;
}
