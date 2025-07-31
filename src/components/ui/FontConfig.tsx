import { ColorPicker, Row, Col, Slider, Switch, Card, Input, Button, Divider } from "antd";
import { HeartFilled, HeartOutlined, ItalicOutlined, ReloadOutlined } from "@ant-design/icons";
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
  globalCustomText: string;
  setGlobalCustomText: React.Dispatch<React.SetStateAction<string>>;
};


const PRESET_COLORS = [
  '#000000', '#333333', '#666666', '#999999',
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
  '#9b59b6', '#1abc9c', '#34495e', '#7f8c8d'
];

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
  globalCustomText,
  setGlobalCustomText,
}: FontConfigProps) {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleClearSearch = () => {
		setSearchValue("");
	};

	const resetSettings = () => {
		setGlobalFontSize(24);
		setGlobalFontWeight(400);
		setGlobalFontColor('#000000');
		setGlobalIsItalic(false);
		setGlobalCustomText('');
	};



	return (
		<Card className="border-0 shadow-md bg-white/90 backdrop-blur-sm">
			<div className="space-y-6">
				{/* 搜索和筛选 */}
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={16} md={12}>
						<Input
							placeholder="🔍 搜索字体名称..."
							allowClear
							value={searchValue}
							onChange={handleSearchChange}
							onClear={handleClearSearch}
							size="large"
							className="rounded-lg border-gray-200 shadow-sm"
						/>
					</Col>
					
					<Col xs={12} sm={8} md={6}>
						<Button 
							type={showOnlyLiked ? "primary" : "default"} 
							onClick={toggleShowLiked} 
							icon={showOnlyLiked ? <HeartFilled /> : <HeartOutlined />}
							size="large"
							block
							className="rounded-lg shadow-sm"
							style={{ 
								background: showOnlyLiked ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
								borderColor: showOnlyLiked ? 'transparent' : undefined
							}}
						>
							{showOnlyLiked ? "显示全部" : "仅收藏"}
						</Button>
					</Col>

					<Col xs={12} sm={8} md={6}>
						<Button 
							onClick={resetSettings}
							icon={<ReloadOutlined />}
							size="large"
							block
							className="rounded-lg shadow-sm"
						>
							重置
						</Button>
					</Col>
				</Row>

				<Divider className="!my-4" />

				{/* 全局文本输入 */}
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
					<h4 className="mb-3 text-gray-700 font-medium flex items-center">
						<span className="mr-2">📝</span>
						全局预览文本
					</h4>
					<Input.TextArea
						value={globalCustomText}
						onChange={(e) => setGlobalCustomText(e.target.value)}
						placeholder="输入要在所有字体中预览的文本...留空使用默认示例"
						rows={2}
						className="rounded-lg border-blue-200 shadow-sm"
					/>
				</div>

				<Divider className="!my-4" />

				{/* 样式控制 */}
				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-100">
					<h4 className="mb-4 text-gray-700 font-medium flex items-center">
						<span className="mr-2">⚙️</span>
						全局样式设置
					</h4>
					<Row gutter={[24, 16]}>
						<Col xs={24} sm={12} md={6}>
							<div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
								<div className="flex justify-between items-center">
									<span className="font-medium text-gray-600">字体大小</span>
									<span className="text-sm text-white bg-gradient-to-r from-blue-400 to-blue-600 px-3 py-1 rounded-full font-medium">{globalFontSize}px</span>
								</div>
								<Slider 
									min={14} 
									max={64} 
									value={globalFontSize} 
									onChange={setGlobalFontSize}
									marks={{
										14: '14',
										24: '24',
										36: '36',
										48: '48'
									}}
								/>
							</div>
						</Col>

						<Col xs={24} sm={12} md={6}>
							<div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
								<div className="flex justify-between items-center">
									<span className="font-medium text-gray-600">字体粗细</span>
									<span className="text-sm text-white bg-gradient-to-r from-purple-400 to-purple-600 px-3 py-1 rounded-full font-medium">{globalFontWeight}</span>
								</div>
								<Slider 
									min={100} 
									max={900} 
									step={100} 
									value={globalFontWeight} 
									onChange={setGlobalFontWeight}
									marks={{
										100: '细',
										400: '正常',
										700: '粗',
										900: '超粗'
									}}
								/>
							</div>
						</Col>

						<Col xs={24} sm={12} md={6}>
							<div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
								<span className="font-medium text-gray-600 block">字体样式</span>
								<Switch
									checked={globalIsItalic}
									onChange={setGlobalIsItalic}
									checkedChildren={<ItalicOutlined />}
									unCheckedChildren="正常"
									size="default"
								/>
							</div>
						</Col>

						<Col xs={24} sm={12} md={6}>
							<div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
								<span className="font-medium text-gray-600 block">字体颜色</span>
								<ColorPicker 
									value={globalFontColor} 
									onChangeComplete={(val) => setGlobalFontColor(val.toCssString())} 
									showText 
									size="middle"
									presets={[
										{
											label: '常用颜色',
											colors: PRESET_COLORS,
										},
									]}
								/>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		</Card>
	);
}
