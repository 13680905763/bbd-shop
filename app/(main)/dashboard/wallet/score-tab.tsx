import { Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IoAddCircleOutline, IoWallet } from "react-icons/io5";

import { getPointsList } from "@/services";

const columns = [
  {
    key: "name",
    label: "AC单号",
  },
  {
    key: "role",
    label: "类型",
  },
  {
    key: "status",
    label: "收入/支出",
  },
];
const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

export default function ScoreTab({ user, tableColumns, texts }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [scoreList, setScoreList] = useState([]);

  useEffect(() => {
    getPointsList().then((res) => {
      console.log("res", res);
      setScoreList(res.data);
    });
  }, []);

  return (
    <div>
      {/* 钱包卡片区域 */}
      <div className="flex justify-between bg-[#ffeee1] rounded-lg p-8">
        <div className="flex items-center gap-2">
          <IoWallet className="w-6 h-6 text-[#f0700c]" />
          <div className="text-lg font-bold">积分</div>
          <span className="text-money-3xl">{user?.myPoints}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            color="primary"
            size="md"
            // onPress={() => setIsOpenRecharge(true)}
          >
            <IoAddCircleOutline className="w-5 h-5" />
            积分兑换优惠券
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="font-bold my-4">积分明细</div>
      {/* <Table
        isHeaderSticky
        classNames={{
          wrapper: "p-0 rounded-none border-1",
          tr: "border-b-1 last:border-b-0 !shadow-none",
          th: "text-default-500 !rounded-none",
        }}
        radius="none"
        shadow="none"
      >
        <TableHeader columns={tableColumns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={texts.noData} items={scoreList}>
          {(item: any) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table> */}
    </div>
    // <div>
    //   <WalletCard
    //     actions={
    //       <Button color="primary" size="md" onPress={() => setIsOpen(true)}>
    //         <IoRepeat className="w-5 h-5" />
    //         积分兑换优惠券
    //       </Button>
    //     }
    //     number={user?.myPoints}
    //     title="积分"
    //   />
    //   <div className="font-bold my-4">积分流水</div>
    //   <Table
    //     removeWrapper
    //     aria-label="Example table with dynamic content"
    //     classNames={{}}
    //   >
    //     <TableHeader columns={columns}>
    //       {(column) => (
    //         <TableColumn key={column.key}>{column.label}</TableColumn>
    //       )}
    //     </TableHeader>
    //     <TableBody items={rows}>
    //       {(item) => (
    //         <TableRow key={item.key}>
    //           {(columnKey) => (
    //             <TableCell>{getKeyValue(item, columnKey)}</TableCell>
    //           )}
    //         </TableRow>
    //       )}
    //     </TableBody>
    //   </Table>
    //   {/* <CommonModal
    //     isOpen={isOpen}
    //     showFooter={false}
    //     title="积分兑换"
    //     onOpenChange={setIsOpen}
    //   >
    //     <div>
    //       <div className="w-full p-5 rounded-lg border-1 border-[#ccc] flex justify-between items-center mb-4">
    //         <div className="flex gap-6">
    //           <div>
    //             <Avatar
    //               size="lg"
    //               src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
    //             />
    //           </div>
    //           <div>
    //             <div className="text-money-xl">CAD 999</div>
    //             <div className="text-xs">
    //               <div>所需积分：50</div>
    //               <div>需要会员等级：1</div>
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <Button color="primary">兑换</Button>
    //         </div>
    //       </div>
    //     </div>
    //   </CommonModal> */}
    // </div>
  );
}
