import TicketQR from "@/components/TicketQR";

export default function TicketPage(props: {
  data: { id: string; locked: boolean; alias: string | null; role: string; }[];
}) {
  return (
    <>
      <h1>{props.data[0].alias}</h1>
      <h1>{props.data[0].role}</h1>
      <h1>{props.data[0].id}</h1>
      <TicketQR id={props.data[0].id.toString()} />
    </>
  );
}
