"use client";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Form,
  Input,
  Snippet,
} from "@heroui/react";
import React from "react";

export default function ForwardingPage() {
  // const [action, setAction] = React.useState(null);

  return (
    <div>
      <div className="bg-[url('https://hoobuy.com/_nuxt/estimation_bg.BPnQS2i-.webp')] bg-no-repeat bg-cover h-[180px]" />

      <div className="container mx-auto flex justify-between gap-5 h-[100%] p-5 ">
        <div className="rounded-lg bg-[#fff] flex-[3] p-8">
          <p className="font-bold mb-5">仓库地址</p>
          <Snippet className="w-full " symbol="">
            <span>Bryant-4-Bryant </span>
            <span>13602579223</span>
            <span>
              中国广东省惠州市水口街道荔枝城工业园晟豪科技大厦8A-801顺道云仓
            </span>
          </Snippet>
          <Divider className="my-4" />

          <p className="font-bold my-5">转运包裹</p>
          <Form
            className="w-full  flex flex-col gap-4"
            // onReset={() => setAction("reset")}
            onSubmit={(e) => {
              e.preventDefault();
              let data = Object.fromEntries(new FormData(e.currentTarget));

              // setAction(`submit ${JSON.stringify(data)}`);
            }}
          >
            <Input
              isRequired
              errorMessage="Please enter a valid username"
              label="物流单号:"
              labelPlacement="outside"
              name="username"
              placeholder="Enter your username"
              type="text"
            />

            <Input
              isRequired
              errorMessage="Please enter a valid email"
              label="包裹名称:"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="text"
            />
          </Form>
        </div>
        <div className="rounded-lg bg-[#fff] flex-1 p-8">
          <CheckboxGroup
            defaultValue={["buenos-aires", "london"]}
            label={<p className="font-bold mb-5">附加服务</p>}
          >
            <Checkbox value="buenos-aires">开箱检查违禁品</Checkbox>
            <Checkbox value="sydney">
              BBDbuy的转发服务默认不提供产品确认。如果您需要产品确认，请选择“产品确认”。
            </Checkbox>
            <Checkbox value="san-francisco">
              取出发票（可减少征税概率）
            </Checkbox>
            <Checkbox value="london">原箱入库</Checkbox>
            <Button className="bg-[#f0700c] text-[#fff]">提交</Button>
            <Checkbox value="tokyo">
              我已阅读和接受 《转发包裹检验规则和服务协议》
            </Checkbox>
          </CheckboxGroup>
        </div>
      </div>
    </div>
  );
}
