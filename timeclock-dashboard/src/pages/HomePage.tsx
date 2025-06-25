import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

export default function HomePage() {
  const members = useQuery(api.team_member.list);

  useEffect(() => {
    console.log(members);
  }, [members]);

  return (
    <>
      <div className="flex-col justify-center w-65/100 m-8">
        <h1 className="text-2xl">Team Dashboard</h1>
        <div>
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>{member.user_id}</TableCell>
                      <TableCell>{member._id}</TableCell>
                      <TableCell>{member.nfc_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
