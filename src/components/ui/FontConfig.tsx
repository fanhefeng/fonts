import { ColorPicker, Row, Col, Slider, Switch, Card, Space, Input, Button } from "antd";
import { HeartFilled, HeartOutlined, ItalicOutlined } from "@ant-design/icons";
import { Color } from "@/types/global";

type FontConfigProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  showOnlyLiked: boolean;
  toggleShowLiked: () => void;
  globalFontSize: number;
  setGlobalFontSize: React.Dispatch<React.SetStateAction<number>>;
  globalIsItalic: boolean;
  setGlobalIsItalic: React.Dispatch<React.SetStateAction<boolean>>;
  globalFontColor: Color;
  setGlobalFontColor: React.Dispatch<React.SetStateAction<Color>>;
  globalFontWeight: number;
  setGlobalFontWeight: React.Dispatch<React.SetStateAction<number>>;
};

export default function FontConfig({
  searchValue,
  setSearchValue,
  showOnlyLiked,
  toggleShowLiked,
  globalFontSize,
  setGlobalFontSize,
  globalIsItalic,
  setGlobalIsItalic,
  globalFontColor,
  setGlobalFontColor,
  globalFontWeight,
  setGlobalFontWeight,
}: FontConfigProps) {
	// 处理搜索输入变化
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("handleSearchChange");
		setSearchValue(e.target.value);
	};

	// 清空搜索
	const handleClearSearch = () => {
		console.log("handleClearSearch");
		setSearchValue("");
	};
	/* 搜索和筛选 */
	const globalExtra = (
		<Space className="">
			<Input
				placeholder="搜索字体..."
				allowClear
				value={searchValue}
				onChange={handleSearchChange}
				onClear={handleClearSearch}
				className="max-w-md flex-grow"
			/>

			<Button type={showOnlyLiked ? "primary" : "default"} onClick={toggleShowLiked} icon={showOnlyLiked ? <HeartFilled /> : <HeartOutlined />}>
				{showOnlyLiked ? "显示所有字体" : "显示收藏"}
			</Button>
		</Space>
	);
	return (
		<>
			<Card title="全局预览设置" extra={globalExtra}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex mb-2">
							<span>Font Size:{globalFontSize}px</span>
						</div>
						<Slider min={12} max={72} value={globalFontSize} onChange={(val) => setGlobalFontSize(val)} />
					</Col>

					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex mb-2">
							<span>Font Weight:{globalFontWeight}</span>
						</div>
						<Slider min={100} max={900} step={100} value={globalFontWeight} onChange={(val) => setGlobalFontWeight(val)} />
					</Col>

					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex mb-2">
							<Switch
								checked={globalIsItalic}
								onChange={(val) => setGlobalIsItalic(val)}
								checkedChildren={<ItalicOutlined />}
								unCheckedChildren="正常"
							/>
						</div>
					</Col>
					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex mb-2">
							<ColorPicker value={globalFontColor} onChangeComplete={(val) => setGlobalFontColor(val.toCssString())} showText size="small" />
						</div>
					</Col>
				</Row>
			</Card>
		</>
	);
}
