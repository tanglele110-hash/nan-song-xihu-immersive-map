(function () {
  const runtimeContent = window.WEST_LAKE_CONTENT || {};
  const scrollDir = "./assets/scroll/north-bank/";
  const coldKnowledgeDir = "./assets/cold-knowledge/hushan-sui-shi/";
  const coldKnowledgeFireDir = "./assets/cold-knowledge/hushang-yanhuo/";
  const coldKnowledgeZip = "./assets/downloads/西湖繁胜冷识集-湖山岁时-24张.zip";
  const coldKnowledgeFireZip = "./assets/downloads/西湖繁胜冷识集-湖上烟火-12张.zip";
  const coldKnowledgeMicroZip = "./assets/downloads/西湖繁胜冷识集-卷中微识-4张.zip";
  const defaultColdKnowledgeCardSize = { width: 1086, height: 1448 };
  const microColdKnowledgeCardSize = { width: 1024, height: 1536 };
  const primaryScrollSegmentId = "volume-dashifo-yuan";
  const fallbackScrollSegments = [
    {
      id: "sisheng-yanxiang-guan",
      title: "孤山四圣延祥观",
      image: "孤山四圣延祥观.jpg",
      width: 9449,
      height: 2480,
    },
    {
      id: "geling-pingzhang-di",
      title: "葛岭寺观平章第",
      image: "葛岭寺观平章第.jpg",
      width: 9449,
      height: 2480,
      cropLeft: 740,
      aliases: ["jiasidao-ci-di"],
    },
    {
      id: primaryScrollSegmentId,
      title: "巨石山下大石佛",
      image: "巨石山下大石佛.jpg",
      width: 9449,
      height: 2480,
      cropLeft: 740,
    },
  ];
  const scrollSegments = Array.isArray(runtimeContent.scrollSegments) && runtimeContent.scrollSegments.length
    ? runtimeContent.scrollSegments
    : fallbackScrollSegments;

  const fallbackColdKnowledgeSections = [
    {
      id: "hushan-sui-shi",
      title: "湖山岁时",
      subtitle: "节气习俗",
      description: "从岁时令节进入南宋临安的湖山风物。",
      packDownload: coldKnowledgeZip,
      cards: Array.from({ length: 24 }, (_, index) => {
        const number = index + 1;
        const padded = String(number).padStart(2, "0");
        return {
          type: "image",
          title: `湖山岁时 ${padded}`,
          label: padded,
          src: `${coldKnowledgeDir}${number}.png`,
          width: defaultColdKnowledgeCardSize.width,
          height: defaultColdKnowledgeCardSize.height,
          alt: `湖山岁时第${padded}张冷识卡片`,
          downloadName: `湖山岁时-${padded}.png`,
        };
      }),
    },
    {
      id: "hushang-yanhuo",
      title: "湖上烟火",
      subtitle: "市井生活",
      description: "从茶酒食饮、舟船游宴到摊贩市声与节庆灯火，照见湖岸日常的热闹生息。",
      packDownload: coldKnowledgeFireZip,
      cards: Array.from({ length: 12 }, (_, index) => {
        const number = index + 1;
        const padded = String(number).padStart(2, "0");
        return {
          type: "image",
          title: `湖上烟火 ${padded}`,
          label: padded,
          src: `${coldKnowledgeFireDir}${number}.png`,
          width: defaultColdKnowledgeCardSize.width,
          height: defaultColdKnowledgeCardSize.height,
          alt: `湖上烟火第${padded}张冷识卡片`,
          downloadName: `湖上烟火-${padded}.png`,
        };
      }),
    },
    {
      id: "juanzhong-weishi",
      title: "卷中微识",
      subtitle: "画卷细节",
      description: "从断桥桥构、大佛造像、沿湖茶担到船上食肆，读南宋西湖交通、信仰与市井消费的细节线索。",
      packDownload: coldKnowledgeMicroZip,
      cards: [
        {
          type: "image",
          title: "断桥",
          label: "01",
          src: "./assets/cold-knowledge/juanzhong-weishi/01.png",
          width: microColdKnowledgeCardSize.width,
          height: microColdKnowledgeCardSize.height,
          alt: "卷中微识第 1 张知识卡片：断桥，红栏白墩的宋代古桥。",
          downloadName: "卷中微识-01.png",
        },
        {
          type: "image",
          title: "大佛头",
          label: "02",
          src: "./assets/cold-knowledge/juanzhong-weishi/02.png",
          width: microColdKnowledgeCardSize.width,
          height: microColdKnowledgeCardSize.height,
          alt: "卷中微识第 2 张知识卡片：大佛头，秦皇缆船石变身记。",
          downloadName: "卷中微识-02.png",
        },
        {
          type: "image",
          title: "茶司",
          label: "03",
          src: "./assets/cold-knowledge/juanzhong-weishi/03.png",
          width: microColdKnowledgeCardSize.width,
          height: microColdKnowledgeCardSize.height,
          alt: "卷中微识第 3 张知识卡片：茶司，宋代的流动茶担。",
          downloadName: "卷中微识-03.png",
        },
        {
          type: "image",
          title: "湖上外卖",
          label: "04",
          src: "./assets/cold-knowledge/juanzhong-weishi/04.png",
          width: microColdKnowledgeCardSize.width,
          height: microColdKnowledgeCardSize.height,
          alt: "卷中微识第 4 张知识卡片：湖上外卖，南宋西湖的流动美食街。",
          downloadName: "卷中微识-04.png",
        },
      ],
    },
  ];
  const coldKnowledgeSections = Array.isArray(runtimeContent.coldKnowledgeSections) && runtimeContent.coldKnowledgeSections.length
    ? runtimeContent.coldKnowledgeSections
    : fallbackColdKnowledgeSections;
  const coldKnowledgeGallery = coldKnowledgeSections.flatMap((section) =>
    section.cards
      .filter((card) => card.type === "image")
      .map((card) => ({
        ...card,
        sectionId: section.id,
        sectionTitle: section.title,
      }))
  );
  const coldKnowledgeIndexBySrc = new Map(coldKnowledgeGallery.map((card, index) => [card.src, index]));

  function optimizedImageSrc(src) {
    if (typeof src !== "string") return src;
    if (!src.startsWith("./assets/") || src.startsWith("./assets/optimized/")) return src;
    if (!/\.(png|jpe?g)$/i.test(src)) return src;
    return src.replace("./assets/", "./assets/optimized/").replace(/\.(png|jpe?g)$/i, ".webp");
  }

  const fallbackMapPoints = [
    {
      id: "map-duanqiao",
      label: "断桥入口",
      region: "西湖北岸",
      status: "open",
      targetType: "node",
      scrollTarget: "duanqiao",
      sourceStatus: "较可信",
      summary: "从湖东桥路入北岸，进入断桥一带的长卷观察。",
      position: { x: 0.82, y: 0.58 },
    },
    {
      id: "map-gushan",
      label: "孤山路入口",
      region: "西湖北岸",
      status: "open",
      targetType: "node",
      scrollTarget: "sisheng-yanxiang-guan",
      sourceStatus: "待考证",
      summary: "沿北岸山水过渡，进入孤山路和近岸建筑段。",
      position: { x: 0.42, y: 0.23 },
    },
    {
      id: "map-baoshu",
      label: "保叔塔入口",
      region: "西湖北岸",
      status: "open",
      targetType: "node",
      scrollTarget: "baoshu-ta-chongshou-yuan",
      sourceStatus: "较可信",
      summary: "以北山塔影为锚点，进入寺观和山麓段。",
      position: { x: 0.55, y: 0.18 },
    },
    {
      id: "map-xicun",
      label: "西村渡口入口",
      region: "西湖北岸",
      status: "open",
      targetType: "node",
      scrollTarget: "xicun-dukou",
      sourceStatus: "待考证",
      summary: "从西村水岸进入市井、舟渡和湖岸收束段。",
      position: { x: 0.17, y: 0.52 },
    },
    {
      id: "map-south-bank",
      label: "南岸待展开",
      region: "西湖南岸",
      status: "locked",
      targetType: "region",
      scrollTarget: "future-south-bank",
      sourceStatus: "创作性推演",
      summary: "当前 MVP 聚焦北岸，全湖其他段后续接入。",
      position: { x: 0.43, y: 0.84 },
    },
    {
      id: "map-city",
      label: "城郭线索",
      region: "湖东城郭",
      status: "pending",
      targetType: "region",
      scrollTarget: "future-city-edge",
      sourceStatus: "待考证",
      summary: "作为后续校准城市与湖岸关系的线索点。",
      position: { x: 0.9, y: 0.36 },
    },
  ];

  const mapPoints = Array.isArray(runtimeContent.mapPoints) && runtimeContent.mapPoints.length
    ? runtimeContent.mapPoints
    : fallbackMapPoints;

  const scrollNodes = [
    node("duanqiao", "断桥", "桥梁", 0.035, 0.64, "北岸入卷处的桥路节点，适合作为从鸟瞰进入长卷的第一处观察。"),
    node("gushan-road", "孤山路", "山水", 0.1, 0.52, "以山路、湖岸与建筑关系为主，先保留图像观察口径。"),
    node("dashifo-yuan", "大石佛院", "寺院", 0.165, 0.47, "标注参考中出现的寺院节点，正式释义仍待补史料来源。"),
    node("shisanjianlou", "十三间楼", "建筑", 0.23, 0.58, "作为北岸建筑群的一处细节点，当前以画面位置和待考证状态呈现。"),
    node("baoshu-ta-chongshou-yuan", "保叔塔与崇寿院", "寺塔", 0.3, 0.33, "塔影与寺院构成北岸识别度较高的远近关系，先以较可信线索标记。", "较可信"),
    node("zhiguo-yuan", "智果院", "寺院", 0.365, 0.48, "节点说明需要后续由地方志、画卷标注和史料交叉核验。"),
    node("yixiu-yuan", "挹秀园", "园林", 0.43, 0.56, "用于承接园林景观与湖岸游观的内容层，当前保持待考证。"),
    node("jiasidao-ci-di", "贾似道赐第", "宅第", 0.495, 0.61, "涉及人物和建筑归属，必须等来源明确后再写成定论。"),
    node("houleyuan-jifang-yuyuan", "后乐园（原集芳御园）", "园林", 0.56, 0.52, "作为后续拾遗重点，首版只建立关联与问题入口。"),
    node("tang-zhaoxian-si-song-chanzong-yuan", "唐招贤寺（宋禅宗院）", "寺院", 0.625, 0.46, "寺名沿革需要单独考证，节点卡片先标注图像观察。"),
    node("chushi-qiao", "处士桥", "桥梁", 0.69, 0.66, "桥梁节点可用于解释湖岸路径和游观节奏。"),
    node("xi-taiyi-gong", "西太乙宫", "宫观", 0.755, 0.5, "宫观类节点需区分画面观察、地名线索与史实证据。"),
    node("sisheng-yanxiang-guan", "四圣延祥观", "宫观", 0.82, 0.45, "作为道观线索进入拾遗层，当前不扩写无来源背景。"),
    node("xicun-jiulou", "西村酒楼", "市井", 0.885, 0.58, "市井与舟渡氛围的代表节点，后续可与声景区域联动。"),
    node("xicun-dukou", "西村渡口", "渡口", 0.95, 0.68, "北岸水路收束处，适合连接问湖线索和后续全卷扩展。"),
  ];

  const fallbackScrollPanoramaNodes = [
    cardNode("xicun-dukou", "西村渡口", "渡口", "sisheng-yanxiang-guan", 0.018, 0.56, 0.035, 0.17, {
      markerLabel: "西村渡口",
      pinyin: "XI · CUN · DU · KOU",
      status: "南宋 · 西湖渡口",
      intro: ["南宋西湖北岸", "西村临湖地带", "水陆转换节点"],
      seal: "渡",
      sections: [
        ["节点简介", "位于西湖西岸西村临湖地带，是南宋西湖北线环湖核心水路节点，衔接水上游船航线与岸上游路，配套西村酒楼形成游宴交通枢纽。"],
        ["南宋建制", "南宋时称西村埠（俗称西村渡口），为官方规制的环湖固定渡口，设石砌埠头与候船廊榭，承担游船停泊、士庶登岸、短途摆渡功能，是西线环湖游赏路线的水陆转换核心节点。"],
        ["今日坐标", "遗址约在今西湖西岸北山街西段临湖区域，宋代原埠头基址与设施已完全湮灭，现存湖岸为后世历次整治后的格局。"],
        ["史迹价值", "是南宋西湖“水上游赏 + 岸上游览”联动体系的典型见证，直观反映了南宋西湖水上交通网络的成熟度与环湖游憩经济的繁盛面貌。"],
      ],
    }),
    cardNode("xicun-jiulou", "西村酒楼", "市井", "sisheng-yanxiang-guan", 0.122, 0.37, 0.035, 0.17, {
      markerLabel: "西村酒楼",
      pinyin: "XI · CUN · JIU · LOU",
      status: "南宋 · 临湖酒楼",
      intro: ["南宋西湖北岸", "西村临湖地带", "游宴商业节点"],
      seal: "酒",
      sections: [
        ["节点简介", "位于西湖西岸西村临湖地带，为南宋时期知名临湖酒楼，是环湖市井商业与游宴文化的核心载体。"],
        ["南宋建制", "南宋时称西村酒楼，为临湖大型商业酒楼，临湖设观景席座，兼具餐饮、宴饮与休闲功能，服务于游湖士庶与文人雅士。"],
        ["今日坐标", "遗址约在今西湖西岸北山街西段区域，原建筑已完全湮灭，无地表遗存。"],
        ["史迹价值", "是南宋西湖游宴文化与环湖商业业态的典型见证，直观反映了南宋临安市民休闲经济与西湖旅游文化的繁盛面貌。"],
      ],
    }),
    cardNode("baoshu-ta-chongshou-yuan", "保俶塔与崇寿院", "寺塔", "sisheng-yanxiang-guan", 0.21, 0.065, 0.04, 0.18, {
      markerLabel: "保俶塔",
      pinyin: "BAO · CHU · TA",
      status: "南宋 · 西湖寺塔",
      intro: ["南宋西湖北岸", "宝石山巅", "视觉地标"],
      seal: "塔",
      sections: [
        ["节点简介", "坐落于宝石山巅，保俶塔为吴越始建的佛塔，山麓配套崇寿院寺院，是南宋西湖北岸最醒目的视觉地标。"],
        ["南宋建制", "南宋时塔称保俶塔，为八级砖木结构佛塔；附属崇寿院为北山正规禅院，塔院一体，是西湖环湖梵刹体系的制高点节点。"],
        ["今日坐标", "保俶塔现存（历代屡经修缮），为西湖核心地标；崇寿院建筑已湮灭，遗址分布于宝石山巅塔基周边。"],
        ["史迹价值", "是五代至南宋西湖佛教建筑的核心代表，其塔院共生的格局见证了西湖山地佛教景观的营造传统。"],
      ],
    }),
    cardNode("sisheng-yanxiang-guan", "四圣延祥观", "宫观", "sisheng-yanxiang-guan", 0.47, 0.12, 0.05, 0.19, {
      markerLabel: "四圣延祥观",
      pinyin: "SI · SHENG · YAN · XIANG · GUAN",
      status: "南宋 · 皇家宫观",
      intro: ["南宋西湖北岸", "孤山南麓", "皇家道教建筑"],
      seal: "观",
      sections: [
        ["节点简介", "位于孤山南麓临湖地带，为南宋皇家敕建道教宫观，是孤山区域规格最高的道教建筑，兼具祭祀与游赏功能。"],
        ["南宋建制", "南宋咸淳年间为四圣延祥观，属御前宫观，主祀天蓬、天猷、翊圣、真武四圣真君，殿宇巍峨，内有六一泉等名胜，由内侍管理，为皇室游湖驻跸之所。"],
        ["今日坐标", "遗址位于今西湖孤山公园南麓，原宫观建筑已完全湮灭，六一泉等附属遗迹尚存。"],
        ["史迹价值", "是南宋皇家道教与山水园林结合的典型代表，见证了南宋道教文化与孤山景观体系的融合发展。"],
      ],
    }),
    cardNode("xi-taiyi-gong", "西太乙宫", "宫观", "sisheng-yanxiang-guan", 0.81, 0.26, 0.04, 0.18, {
      markerLabel: "西太乙宫",
      pinyin: "XI · TAI · YI · GONG",
      status: "南宋 · 皇家宫观",
      intro: ["南宋西湖北岸", "钱塘门外", "国家祭祀建筑"],
      seal: "宫",
      sections: [
        ["节点简介", "位于钱塘门外临湖地带，为南宋皇家敕建道教宫观，是杭州规格最高的国家级道教祭祀建筑之一。"],
        ["南宋建制", "南宋咸淳年间为西太乙宫，属御前皇家宫观，主祀太乙神，殿宇宏丽，规制比照皇家宫殿，由朝廷委派官员管理，承担国家祭祀功能。"],
        ["今日坐标", "遗址约在今北山街东段靠近钱塘门区域，宋代原构建筑已完全湮灭，无地表遗存。"],
        ["史迹价值", "是南宋皇家道教体系的核心建筑代表，见证了南宋国家祭祀制度与道教建筑的高等级营造规制。"],
      ],
    }),
    cardNode("chushi-qiao", "处士桥", "桥梁", "sisheng-yanxiang-guan", 0.948, 0.835, 0.035, 0.17, {
      markerLabel: "处士桥",
      pinyin: "CHU · SHI · QIAO",
      status: "南宋 · 西湖桥梁",
      intro: ["南宋西湖北岸", "孤山西北麓", "环湖交通节点"],
      seal: "桥",
      sections: [
        ["节点简介", "位于西湖西岸环湖地带，为南宋跨水石桥，因关联北宋处士林逋得名，是环湖交通与景观结合的典型节点。"],
        ["南宋建制", "南宋时称处士桥，为石砌拱桥，是西岸环湖游路的核心桥梁，连通南北寺观园林，为游湖士庶的必经之地。"],
        ["今日坐标", "遗址约在今孤山西北麓环湖区域，原宋代石桥已不存，后世屡经改建，格局已发生变化。"],
        ["史迹价值", "是南宋西湖环湖交通体系的实物见证，其命名承载了西湖隐逸文化记忆，是人文与景观结合的典型节点。"],
      ],
    }),
    cardNode("manao-si", "玛瑙寺", "寺院", "geling-pingzhang-di", 0.647, 0.235, 0.04, 0.18, {
      markerLabel: "玛瑙寺",
      pinyin: "MA · NAO · SI",
      status: "南宋 · 西湖古刹",
      intro: ["南宋西湖北岸", "宝石山西麓", "禅宗寺院"],
      seal: "寺",
      sections: [
        ["节点简介", "位于宝石山西麓，五代始建，原名玛瑙宝胜院，因山产玛瑙石得名，南宋时为北山历史悠久的知名古刹。"],
        ["南宋建制", "南宋时定名玛瑙宝胜院（俗称玛瑙寺），属禅宗寺院，殿宇依山错落排布，坐拥湖山之胜，规制完备，为北山核心梵刹之一。"],
        ["今日坐标", "遗址位于今北山街玛瑙寺地块，尚存部分明清建筑与千年古樟等历史遗存，为杭州市文物保护点。"],
        ["史迹价值", "是西湖北山少数基址沿革清晰、延续千年的古寺院，见证了五代至南宋西湖佛教建筑的发展脉络与营造技艺。"],
      ],
    }),
    cardNode("houleyuan-jifang-yuyuan", "后乐园", "园林", "geling-pingzhang-di", 0.52, 0.235, 0.04, 0.18, {
      markerLabel: "后乐园",
      pinyin: "HOU · LE · YUAN",
      status: "南宋 · 权贵园林",
      intro: ["南宋西湖北岸", "葛岭山麓", "私家园林"],
      seal: "园",
      sections: [
        ["节点简介", "位于葛岭山麓，为南宋权臣贾似道营建的私家园林，取“后天下之乐而乐”之意，是南宋后期西湖规模最大的权贵园林。"],
        ["南宋建制", "咸淳年间臻于鼎盛，依葛岭湖山之势构筑亭台楼阁、水榭池馆，引水造景，广植花木，兼具雅集、宴饮与休闲功能，代表南宋私家园林最高水准。"],
        ["今日坐标", "遗址位于今葛岭一带临湖区域，原园林建筑已完全湮灭，部分山水基底与地形格局仍可寻迹。"],
        ["史迹价值", "是南宋权贵园林的巅峰代表，集中体现了南宋西湖造园艺术的最高成就，也是南宋后期社会阶层与园林文化的缩影。"],
      ],
    }),
    cardNode("jiasidao-ci-di", "贾似道赐第", "宅第", "geling-pingzhang-di", 0.628, 0.495, 0.04, 0.18, {
      markerLabel: "贾似道赐第",
      pinyin: "JIA · SI · DAO · CI · DI",
      status: "南宋 · 权贵宅第",
      intro: ["南宋西湖北岸", "葛岭东麓", "宅园合一"],
      seal: "第",
      sections: [
        ["节点简介", "位于葛岭东麓临湖地带，为南宋理宗赐予权臣贾似道的官邸，是南宋后期西湖西岸规格最高的权贵宅邸。"],
        ["南宋建制", "咸淳年间为贾似道“平章军国事”的行在宅邸，规制宏敞，兼具办公、居住与游赏功能，与西侧后乐园连为一体，形成宅园合一的格局。"],
        ["今日坐标", "遗址位于今葛岭东段临湖区域，原宅邸建筑已完全湮灭，仅存少量基址与相关摩崖刻石遗迹。"],
        ["史迹价值", "是南宋权臣政治与西湖宅园文化结合的典型代表，为研究南宋后期政治史、建筑史与园林史提供了重要线索。"],
      ],
    }),
    cardNode("baoyun-si", "宝云寺", "寺院", "geling-pingzhang-di", 0.766, 0.19, 0.04, 0.18, {
      markerLabel: "宝云寺",
      pinyin: "BAO · YUN · SI",
      status: "南宋 · 西湖尼院",
      intro: ["南宋西湖北岸", "北山之阳", "佛教尼院"],
      seal: "寺",
      sections: [
        ["节点简介", "位于西湖北山之阳，北宋始建，南宋时为环湖梵刹体系中的中型尼院，以环境清幽著称。"],
        ["南宋建制", "南宋时定名宝云院（俗称宝云寺），为比丘尼寺院，殿堂规整，依山临湖，是北山佛教景观带的组成部分。"],
        ["今日坐标", "遗址约在今北山街沿线临湖区域，宋代原构建筑已完全湮灭，无地表遗存。"],
        ["史迹价值", "是南宋西湖佛教体系中尼寺类建筑的代表，为研究南宋杭州佛教群体构成与寺院布局提供了历史参照。"],
      ],
    }),
    cardNode("tang-zhaoxian-si-song-chanzong-yuan", "唐招贤寺", "寺院", "geling-pingzhang-di", 0.238, 0.22, 0.04, 0.18, {
      markerLabel: "唐招贤寺",
      pinyin: "TANG · ZHAO · XIAN · SI",
      status: "南宋 · 西湖古刹",
      intro: ["南宋西湖北岸", "北山临湖地带", "唐代古刹"],
      seal: "寺",
      sections: [
        ["节点简介", "位于西湖北山临湖地带，始建于唐代，故名“唐招贤寺”，南宋时历经重修，是环湖少数肇始于唐的古刹。"],
        ["南宋建制", "南宋咸淳年间定名招贤寺，俗称唐招贤寺，属佛教教院体系，殿堂齐备，寺内多古木碑刻，临湖而建，为香客巡礼与游人休憩之所。"],
        ["今日坐标", "遗址约在今北山街西段临湖区域，宋代原构建筑已完全湮灭，具体基址待考古确认。"],
        ["史迹价值", "是西湖佛教文化自唐至宋传承延续的重要见证，为研究杭州早期佛教传播与西湖景观演变提供了历史参照。"],
      ],
    }),
    cardNode("yixiu-yuan", "挹秀园", "园林", primaryScrollSegmentId, 0.166, 0.47, 0.04, 0.18, {
      markerLabel: "挹秀园",
      pinyin: "YI · XIU · YUAN",
      status: "南宋 · 士人园林",
      intro: ["南宋西湖北岸", "北山临湖地带", "士人园林"],
      seal: "园",
      sections: [
        ["节点简介", "位于西湖北山临湖地带，为南宋中期知名私家园林，因揽纳湖山秀色得名，是士人雅集游赏的重要场所。"],
        ["南宋建制", "南宋时称挹秀园，依湖山之势构筑亭台，临湖设观景台榭，可远眺南北两山，为北山园林带中士人园林的代表。"],
        ["今日坐标", "遗址约在今北山街中段临湖区域，原园林建筑与山水格局已完全湮灭。"],
        ["史迹价值", "代表了南宋西湖士人阶层的园林审美与造园理念，是南宋环湖私家园林兴盛局面的重要佐证。"],
      ],
    }),
    cardNode("duobao-si", "多宝寺", "寺院", primaryScrollSegmentId, 0.286, 0.108, 0.04, 0.18, {
      markerLabel: "多宝寺",
      pinyin: "DUO · BAO · SI",
      status: "南宋 · 西湖寺院",
      intro: ["南宋西湖北岸", "宝石山南麓", "环湖梵刹"],
      seal: "寺",
      sections: [
        ["节点简介", "位于宝石山南麓临湖地带，五代始建，南宋时为西湖北山环湖梵刹序列中的重要寺院。"],
        ["南宋建制", "南宋时定名多宝寺，属佛教教院体系，殿堂齐备，临湖而建，与周边大石佛院、崇寿院共同构成北山佛教景观带。"],
        ["今日坐标", "遗址约在今宝石山东南麓临湖区域，宋代原构建筑已完全湮灭，无明确地表遗存。"],
        ["史迹价值", "是南宋西湖环湖寺院格局的重要组成节点，见证了五代至南宋北山佛教传播与寺院分布的历史脉络。"],
      ],
    }),
    cardNode("zhiguo-yuan", "智果院", "寺院", "geling-pingzhang-di", 0.989, 0.198, 0.04, 0.18, {
      markerLabel: "智果院",
      pinyin: "ZHI · GUO · YUAN",
      status: "南宋 · 北山禅院",
      intro: ["南宋西湖北岸", "宝石山西麓", "智果泉名胜"],
      seal: "院",
      sections: [
        ["节点简介", "位于宝石山西麓，北宋始建，南宋时为北山知名禅院，以林泉清幽、智果泉名世，是文人与僧人交游的核心场所。"],
        ["南宋建制", "南宋时定名智果院，属禅宗寺院，殿宇依山而建，院内有名泉智果泉，兼具修行与游赏功能，为北山禅院代表。"],
        ["今日坐标", "遗址位于今宝石山西侧，宋代建筑已湮灭，智果泉泉眼遗迹尚存，可寻历史脉络。"],
        ["史迹价值", "是两宋西湖“禅院园林化”特征的典型代表，见证了宋代文人与禅僧交游文化的发展与兴盛。"],
      ],
    }),
    cardNode("shuiyue-yuan", "水月园", "园林", primaryScrollSegmentId, 0.348, 0.35, 0.04, 0.18, {
      markerLabel: "水月园",
      pinyin: "SHUI · YUE · YUAN",
      status: "南宋 · 临湖御园",
      intro: ["南宋西湖北岸", "钱塘门外", "水景园林"],
      seal: "园",
      sections: [
        ["节点简介", "位于钱塘门外临湖地带，为南宋北山知名园林，以临湖赏月的水景营造为核心特色，是南宋西湖名园的代表之一。"],
        ["南宋建制", "南宋时初为权臣杨沂中别业，后收归官营，称水月御园，为皇室与朝臣游赏宴饮之所，临湖构亭榭，是北山园林带的核心节点。"],
        ["今日坐标", "遗址约在今北山街东段临湖区域，原园林建筑与格局已完全湮灭，无地表宋代遗存。"],
        ["史迹价值", "是南宋私家园林向官营御园转变的典型样本，代表了南宋西湖临湖造园的艺术水准与皇家游赏文化特征。"],
      ],
    }),
    cardNode("shisanjianlou", "十三间楼", "建筑", primaryScrollSegmentId, 0.59, 0.16, 0.04, 0.18, {
      markerLabel: "十三间楼",
      pinyin: "SHI · SAN · JIAN · LOU",
      status: "南宋 · 登览楼阁",
      intro: ["南宋西湖北岸", "大石佛院后山", "文人雅集地"],
      seal: "楼",
      sections: [
        ["节点简介", "位于大石佛院后山山巅，为吴越始建的连廊式楼阁，两宋时期是文人登高览胜、雅集题咏的核心胜地。"],
        ["南宋建制", "南宋时称十三间楼，为北山标志性观景建筑，兼具宴饮、题咏、游赏功能，是临安士人西湖交游的高频打卡地。"],
        ["今日坐标", "宋代原构建筑已完全湮灭，遗址位于今宝石山南麓大石佛院后山区域，地表无宋代建筑遗存。"],
        ["史迹价值", "见证了两宋西湖文人游赏文化的兴盛，是研究南宋士人交游传统与西湖雅集文化的重要史迹节点。"],
      ],
    }),
    cardNode("dashifo-yuan", "大石佛院（兜率寺）", "寺院", primaryScrollSegmentId, 0.655, 0.245, 0.05, 0.19, {
      markerLabel: "大石佛院",
      pinyin: "DA · SHI · FO · YUAN",
      status: "南宋 · 西湖梵刹",
      intro: ["南宋西湖北岸", "宝石山东南麓", "摩崖造像寺院"],
      seal: "佛",
      sections: [
        ["节点简介", "坐落于宝石山东南麓，依托天然秦皇缆船石雕凿金装半身石佛，又称“大佛头”，是南宋临安城北最负盛名的梵刹之一。"],
        ["南宋建制", "南宋时官方定名兜率寺，别名大石佛院，形成“石佛与梵宫共生”的独特格局，主殿为最高等级重檐歇山顶，覆盖金装摩崖石佛。"],
        ["今日坐标", "遗存位于杭州市北山街 25 号院内，石佛残迹与清代弥勒院建筑尚存，为杭州重要历史史迹。"],
        ["史迹价值", "是西湖规模最大的古代摩崖造像之一，为研究南宋佛教艺术、西湖营造格局提供了核心实物佐证。"],
      ],
    }),
    cardNode("duanqiao", "断桥", "桥梁", primaryScrollSegmentId, 0.86, 0.58, 0.04, 0.18, {
      markerLabel: "断桥",
      pinyin: "DUAN · QIAO",
      status: "南宋 · 西湖堤桥",
      intro: ["南宋西湖北岸", "白堤东端", "核心景观桥梁"],
      seal: "桥",
      sections: [
        ["节点简介", "位于白堤东端，跨西湖内湖与外湖，是南宋西湖北岸连通临安城区的核心景观桥梁，也是白堤的标志性起点。"],
        ["南宋建制", "南宋时正式称断桥，为石墩木梁式平桥，桥畔建有亭阁，是钱塘门入城游湖的第一节点，属西湖核心地标景观。"],
        ["今日坐标", "位于今西湖白堤东端，现存桥梁为后世改建，格局与南宋略有差异，为西湖核心标志性景观。"],
        ["史迹价值", "是南宋西湖“一湖三堤”景观格局的核心组成节点，见证了八百年来西湖堤桥体系的沿革，承载着西湖文化的核心记忆。"],
      ],
    }),
  ];

  const scrollPanoramaNodes = Array.isArray(runtimeContent.scrollPanoramaNodes) && runtimeContent.scrollPanoramaNodes.length
    ? runtimeContent.scrollPanoramaNodes
    : fallbackScrollPanoramaNodes;

  const fallbackNotes = [
    {
      id: "note-entry-map",
      category: "画作概览",
      title: "从卷首到鸟瞰入口",
      status: "创作性解读",
      relatedNode: "duanqiao",
      summary: "Landing 与入画的关系被处理为从题名、卷首到全湖示意图的空间转换，帮助用户先建立观看仪式和方位感。",
      source: "项目设计说明，待补外部史料。",
    },
    {
      id: "note-north-bank",
      category: "图像线索",
      title: "西湖北岸十五处细节点",
      status: "待考证",
      relatedNode: "gushan-road",
      summary: "十五个节点来自当前 MVP 已确认清单，页面只使用节点名、图像位置和证据状态，不扩写未核实史实。",
      source: "PRD v0.6 节点清单。",
    },
    {
      id: "note-baoshu",
      category: "图像线索",
      title: "塔影与山麓寺院",
      status: "较可信",
      relatedNode: "baoshu-ta-chongshou-yuan",
      summary: "保叔塔与崇寿院适合作为北岸空间识别锚点，后续需补充出处、年代和画中位置依据。",
      source: "标注图与节点清单，待补文献。",
    },
    {
      id: "note-uncertain",
      category: "未定问题",
      title: "园林名称和沿革待核验",
      status: "待考证",
      relatedNode: "houleyuan-jifang-yuyuan",
      summary: "后乐园、集芳御园等名称涉及沿革与时段差异，首版在问湖中开放线索征集。",
      source: "待补来源。",
    },
    {
      id: "note-soundscape",
      category: "方法论",
      title: "随动声景的占位层",
      status: "创作性解读",
      relatedNode: "xicun-jiulou",
      summary: "MVP 先以水岸、市井、寺钟三类占位声层验证交互逻辑，正式音频需另行授权。",
      source: "TDD v0.4 声景策略。",
    },
  ];

  const notes = Array.isArray(runtimeContent.notes) && runtimeContent.notes.length
    ? runtimeContent.notes
    : fallbackNotes;

  const fallbackInquiries = [
    {
      id: "inq-001",
      type: "question",
      title: "后乐园与集芳御园的名称关系如何处理？",
      status: "待核验",
      related: "后乐园（原集芳御园）",
      content: "希望补充名称沿革、时间段和可引用出处，避免页面直接写成定论。",
    },
    {
      id: "inq-002",
      type: "clue",
      title: "保叔塔周边寺院线索需要来源",
      status: "待核验",
      related: "保叔塔与崇寿院",
      content: "可优先检索地方志、图录和相关论文，确认画中寺院组合的表述口径。",
    },
    {
      id: "inq-003",
      type: "task",
      title: "录入鸟瞰图可见入口点",
      status: "待核验",
      related: "入画地图",
      content: "依据标注版本鸟瞰图，只录入适合全局入口的点，不强制覆盖十五个游湖节点。",
    },
  ];

  const inquiries = Array.isArray(runtimeContent.inquiries) && runtimeContent.inquiries.length
    ? runtimeContent.inquiries
    : fallbackInquiries;

  const audioZones = [
    { id: "water", label: "水岸", start: 0, end: 0.36, frequency: 174 },
    { id: "temple", label: "远寺", start: 0.36, end: 0.72, frequency: 96 },
    { id: "market", label: "市井", start: 0.72, end: 1.01, frequency: 228 },
  ];

  const views = Array.from(document.querySelectorAll(".view"));
  const shell = document.getElementById("app-shell");
  const mapPointLayer = document.getElementById("map-points");
  const mapPanel = document.getElementById("map-panel");
  const scrollStage = document.getElementById("scroll-stage");
  const scrollTrack = document.getElementById("scroll-track");
  const scrollRange = document.getElementById("scroll-range");
  const nodePills = document.getElementById("node-pills");
  const activeZoneLabel = document.getElementById("active-zone");
  const noteNav = document.getElementById("note-nav");
  const notesList = document.getElementById("notes-list");
  const inquiryList = document.getElementById("inquiry-list");
  const inquiryForm = document.getElementById("inquiry-form");
  const inquiryRelated = document.getElementById("inquiry-related");
  const coldKnowledgeRoot = document.getElementById("cold-knowledge-sections");
  const soundToggle = document.getElementById("sound-toggle");
  const scrollSoundToggle = document.getElementById("scroll-sound-toggle");
  const nodeOverlay = document.getElementById("node-overlay");

  const state = {
    view: "landing",
    scrollWidth: 1,
    scrollHeight: 1,
    scrollMaxOffset: 0,
    scrollMaxYOffset: 0,
    scrollOffsetY: 0,
    scrollZoom: 1,
    currentNorm: 0,
    targetNorm: 0,
    selectedNode: null,
    currentNoteCategory: "全部",
    inquiryFilter: "all",
    coldExpandedSections: {},
    coldPreviewIndex: 0,
    coldPreviewWheelAt: 0,
    dragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    explicitActiveNode: null,
    soundEnabled: false,
    activeAudioZone: "water",
    pendingTarget: null,
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let audioContext = null;
  let masterGain = null;
  let zoneGains = {};

  function segmentNode(id, title, category, x, y, width, height, summary, status = "待考证", segmentId = primaryScrollSegmentId) {
    const segment = segmentMetrics(segmentId);
    const originalX = x * segment.originalWidth;
    const originalWidth = width * segment.originalWidth;
    const displayX = (originalX - segment.cropLeft) / segment.displayWidth;
    const displayWidth = originalWidth / segment.displayWidth;
    const mappedX = segment.offset + displayX * segment.width;
    const mappedWidth = displayWidth * segment.width;
    const item = node(id, title, category, mappedX + mappedWidth / 2, y + height / 2, summary, status);
    item.hit = { x: mappedX, y, width: mappedWidth, height };
    item.segmentId = segmentId;
    return item;
  }

  function cardNode(id, title, category, segmentId, x, y, width, height, card) {
    const item = segmentNode(id, title, category, x, y, width, height, card.sections[0][1], "较可信", segmentId);
    item.card = card;
    item.markerLabel = card.markerLabel || title;
    item.subtitle = card.pinyin;
    return item;
  }

  function segmentMetrics(segmentId) {
    const totalWidth = scrollSegments.reduce((sum, segment) => sum + displaySegmentWidth(segment), 0);
    let offset = 0;
    for (const segment of scrollSegments) {
      const displayWidth = displaySegmentWidth(segment);
      const width = displayWidth / totalWidth;
      if (segment.id === segmentId || (segment.aliases || []).includes(segmentId)) {
        return {
          offset,
          width,
          cropLeft: segment.cropLeft || 0,
          cropRight: segment.cropRight || 0,
          displayWidth,
          originalWidth: segment.width,
        };
      }
      offset += width;
    }
    return { offset: 0, width: 1, cropLeft: 0, cropRight: 0, displayWidth: 1, originalWidth: 1 };
  }

  function displaySegmentWidth(segment) {
    return segment.width - (segment.cropLeft || 0) - (segment.cropRight || 0);
  }

  function findScrollTarget(id) {
    const nodeTarget = scrollPanoramaNodes.find((entry) => entry.id === id);
    if (nodeTarget) return nodeTarget;
    const segment = scrollSegments.find((entry) => entry.id === id || (entry.aliases || []).includes(id));
    if (!segment) return null;
    const metrics = segmentMetrics(segment.id);
    return {
      id: segment.id,
      title: segment.title,
      position: { x: metrics.offset + metrics.width / 2, y: 0.5 },
    };
  }

  function node(id, title, category, x, y, summary, status = "待考证") {
    return {
      id,
      title,
      category,
      sourceStatus: status,
      position: { x, y },
      subtitle: "西湖北岸细节点",
      summary,
      source: status === "较可信" ? "标注参考图与节点清单，待补外部史料。" : "待补史料来源。",
      noteId: status === "较可信" ? "note-baoshu" : "note-north-bank",
    };
  }

  function init() {
    renderMapPoints();
    renderScroll();
    renderNodePills();
    renderNotes();
    renderInquiry();
    renderColdKnowledge();
    bindEvents();
    handleRoute();
    refreshScrollMetrics();
    requestAnimationFrame(tick);
  }

  function renderMapPoints() {
    if (!mapPointLayer) return;
    mapPointLayer.innerHTML = "";
    mapPoints.forEach((point) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-point";
      button.dataset.status = point.status;
      button.style.left = `${point.position.x * 100}%`;
      button.style.top = `${point.position.y * 100}%`;
      button.setAttribute("aria-label", `${point.label}，${point.sourceStatus}`);
      button.innerHTML = `
        <span class="map-tooltip">
          <strong>${point.label}</strong>
          ${point.summary}<br />
          <small>${point.region} · ${point.sourceStatus}</small>
        </span>
      `;
      button.addEventListener("mouseenter", () => updateMapPanel(point));
      button.addEventListener("focus", () => updateMapPanel(point));
      button.addEventListener("click", () => {
        updateMapPanel(point);
        if (point.status === "open") {
          navigate(`scroll?target=${encodeURIComponent(point.scrollTarget)}`);
        }
      });
      mapPointLayer.appendChild(button);
    });
  }

  function updateMapPanel(point) {
    if (!mapPanel) return;
    const statusText = point.status === "open" ? "可进入" : point.status === "pending" ? "待考证" : "待展开";
    mapPanel.innerHTML = `
      <p class="panel-eyebrow">${point.region}</p>
      <h3>${point.label}</h3>
      <p>${point.summary}</p>
      <div class="legend-row">
        <span><i class="legend-dot ${point.status}"></i>${statusText}</span>
        <span>${point.sourceStatus}</span>
        <span>目标：${point.targetType}</span>
      </div>
    `;
  }

  function renderScroll() {
    scrollTrack.innerHTML = "";
    scrollSegments.forEach((segment) => {
      const frame = document.createElement("div");
      frame.className = "scroll-segment-frame";
      frame.dataset.segment = segment.id;
      frame.dataset.cropLeft = String(segment.cropLeft || 0);
      frame.dataset.cropRight = String(segment.cropRight || 0);
      const image = document.createElement("img");
      image.className = "scroll-panorama-image";
      image.dataset.segment = segment.id;
      image.alt = `${segment.title}分卷`;
      image.width = segment.width;
      image.height = segment.height;
      image.decoding = "async";
      image.loading = "lazy";
      image.addEventListener("load", refreshScrollMetrics, { once: true });
      image.src = optimizedImageSrc(segment.src || scrollDir + segment.image);
      frame.appendChild(image);
      scrollTrack.appendChild(frame);
    });

    scrollPanoramaNodes.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "scroll-node-hotspot";
      button.dataset.node = item.id;
      button.style.left = `${item.hit.x * 100}%`;
      button.style.top = `${item.hit.y * 100}%`;
      button.style.width = `${item.hit.width * 100}%`;
      button.style.height = `${item.hit.height * 100}%`;
      button.setAttribute("aria-label", item.title);
      if (item.card) {
        button.classList.add("scroll-bridge-marker");
        button.innerHTML = `
          <span class="bridge-marker-emblem" aria-hidden="true"></span>
          <span class="bridge-marker-label" aria-hidden="true">${markerLabelMarkup(item.markerLabel || item.title)}</span>
          <span class="bridge-marker-dot" aria-hidden="true"></span>
        `;
      }
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        selectNode(item.id, true);
      });
      scrollTrack.appendChild(button);
    });
  }

  function renderNodePills() {
    if (!nodePills) return;
    nodePills.innerHTML = "";
    scrollNodes.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "node-pill";
      button.textContent = `${index + 1}. ${item.title}`;
      button.addEventListener("click", () => {
        locateNode(item.id, true);
        selectNode(item.id, false);
      });
      nodePills.appendChild(button);
    });
  }

  function renderNotes() {
    if (!noteNav || !notesList) return;
    const categories = ["全部", ...Array.from(new Set(notes.map((item) => item.category)))];
    noteNav.innerHTML = "";
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = category;
      button.className = category === state.currentNoteCategory ? "is-current" : "";
      button.addEventListener("click", () => {
        state.currentNoteCategory = category;
        renderNotes();
      });
      noteNav.appendChild(button);
    });

    const visible = state.currentNoteCategory === "全部"
      ? notes
      : notes.filter((item) => item.category === state.currentNoteCategory);
    notesList.innerHTML = "";
    visible.forEach((item) => {
      const article = document.createElement("article");
      article.className = "note-item";
      article.innerHTML = `
        <div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </div>
        <aside class="note-side">
          <span class="note-status" data-status="${item.status}">${item.status}</span>
          <span>${item.category}</span>
          <span>关联：${labelForNode(item.relatedNode)}</span>
          <small>${item.source}</small>
          <button class="note-link" type="button">回到画卷位置</button>
        </aside>
      `;
      article.querySelector(".note-link").addEventListener("click", () => {
        navigate(`scroll?target=${encodeURIComponent(item.relatedNode)}`);
      });
      notesList.appendChild(article);
    });
  }

  function renderInquiry() {
    if (!inquiryRelated || !inquiryList) return;
    inquiryRelated.innerHTML = `
      <option value="global">全局问题</option>
      ${mapPoints.map((point) => `<option value="${point.id}">地图点：${point.label}</option>`).join("")}
      ${scrollNodes.map((item) => `<option value="${item.id}">游湖节点：${item.title}</option>`).join("")}
      ${notes.map((item) => `<option value="${item.id}">拾遗：${item.title}</option>`).join("")}
    `;
    renderInquiryList();
  }

  function renderInquiryList() {
    if (!inquiryList) return;
    const visible = inquiries.filter((item) => {
      if (state.inquiryFilter === "all") return true;
      if (state.inquiryFilter === "pending") return item.status === "待核验";
      return item.type === state.inquiryFilter;
    });
    inquiryList.innerHTML = "";
    visible.forEach((item) => {
      const article = document.createElement("article");
      article.className = "inquiry-item";
      article.innerHTML = `
        <div class="inquiry-meta">
          <span>${typeLabel(item.type)}</span>
          <span class="pending">${item.status}</span>
          <span>${item.related}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.content}</p>
      `;
      inquiryList.appendChild(article);
    });
  }

  function renderColdKnowledge() {
    if (!coldKnowledgeRoot) return;
    coldKnowledgeRoot.innerHTML = coldKnowledgeSections.map((section, index) => {
      const visibleCards = section.cards.slice(0, 8);
      const hiddenCards = section.cards.slice(8);
      const isExpanded = Boolean(state.coldExpandedSections[section.id]);
      const cardsToRender = isExpanded ? visibleCards.concat(hiddenCards) : visibleCards;
      const downloadAction = section.packDownload
        ? `<a class="cold-action-link" href="${section.packDownload}" download>打包下载</a>`
        : "";
      const moreAction = hiddenCards.length
        ? `<button class="cold-more-button" type="button" data-cold-more="${section.id}" aria-expanded="${isExpanded}">${isExpanded ? "收起" : `更多 ${hiddenCards.length} 张`}</button>`
        : "";
      return `
        <section class="cold-section" data-cold-section="${section.id}">
          <div class="cold-section-head">
            <div>
              <span class="cold-section-number">${String(index + 1).padStart(2, "0")}</span>
              <h3>${section.title}</h3>
              <p>${section.subtitle} · ${section.description}</p>
            </div>
            <div class="cold-section-actions">
              ${downloadAction}
              ${moreAction}
            </div>
          </div>
          <div class="cold-card-grid">
            ${cardsToRender.map(renderColdKnowledgeCard).join("")}
          </div>
        </section>
      `;
    }).join("");

    coldKnowledgeRoot.querySelectorAll("[data-cold-more]").forEach((button) => {
      button.addEventListener("click", () => {
        const sectionId = button.dataset.coldMore;
        state.coldExpandedSections[sectionId] = !state.coldExpandedSections[sectionId];
        renderColdKnowledge();
        const section = coldKnowledgeRoot.querySelector(`[data-cold-section="${sectionId}"]`);
        if (section) section.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
    coldKnowledgeRoot.querySelectorAll("[data-cold-card-src]").forEach((card) => {
      card.addEventListener("click", () => {
        openColdKnowledgePreview(Number(card.dataset.coldCardIndex));
      });
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openColdKnowledgePreview(Number(card.dataset.coldCardIndex));
      });
    });
  }

  function renderColdKnowledgeCard(card) {
    if (card.type === "image") {
      const galleryIndex = coldKnowledgeIndexBySrc.get(card.src);
      const cardWidth = Number(card.width);
      const cardHeight = Number(card.height);
      const hasCardSize = Number.isFinite(cardWidth) && Number.isFinite(cardHeight) && cardWidth > 0 && cardHeight > 0;
      const ratioStyle = hasCardSize ? ` style="--cold-card-ratio: ${cardWidth} / ${cardHeight}"` : "";
      const dimensionAttrs = hasCardSize ? ` width="${cardWidth}" height="${cardHeight}"` : "";
      const displaySrc = optimizedImageSrc(card.src);
      return `
        <article class="cold-card cold-card-image"${ratioStyle} role="button" tabindex="0" data-cold-card-index="${galleryIndex}" data-cold-card-src="${card.src}" data-cold-card-alt="${card.alt}">
          <div class="cold-card-media">
            <img src="${displaySrc}" alt="${card.alt}"${dimensionAttrs} loading="lazy" decoding="async" />
          </div>
        </article>
      `;
    }
    return `
      <article class="cold-card cold-card-placeholder">
        <h4>${card.title}</h4>
        <p>${card.note}</p>
      </article>
    `;
  }

  function openColdKnowledgePreview(index) {
    if (!coldKnowledgeGallery.length) return;
    const normalizedIndex = normalizeColdKnowledgeIndex(index);
    let preview = document.getElementById("cold-card-preview");
    if (!preview) {
      preview = document.createElement("div");
      preview.id = "cold-card-preview";
      preview.className = "cold-card-preview";
      preview.innerHTML = `
        <button class="cold-card-preview-close" type="button" aria-label="关闭预览">×</button>
        <button class="cold-card-preview-nav cold-card-preview-prev" type="button" data-cold-preview-step="-1" aria-label="上一张知识卡片">‹</button>
        <figure class="cold-card-preview-stage">
          <img alt="" />
          <figcaption class="cold-card-preview-caption">
            <span class="cold-card-preview-title"></span>
            <span class="cold-card-preview-count"></span>
          </figcaption>
        </figure>
        <button class="cold-card-preview-nav cold-card-preview-next" type="button" data-cold-preview-step="1" aria-label="下一张知识卡片">›</button>
      `;
      document.body.appendChild(preview);
      preview.addEventListener("click", (event) => {
        const stepButton = event.target.closest("[data-cold-preview-step]");
        if (stepButton) {
          stepColdKnowledgePreview(Number(stepButton.dataset.coldPreviewStep));
          return;
        }
        if (event.target === preview || event.target.closest(".cold-card-preview-close")) {
          closeColdKnowledgePreview();
        }
      });
      preview.addEventListener("wheel", onColdKnowledgePreviewWheel, { passive: false });
    }
    updateColdKnowledgePreview(normalizedIndex);
    preview.classList.add("is-open");
    document.body.classList.add("has-cold-preview");
    preview.querySelector(".cold-card-preview-close").focus({ preventScroll: true });
  }

  function closeColdKnowledgePreview() {
    const preview = document.getElementById("cold-card-preview");
    if (!preview) return;
    preview.classList.remove("is-open");
    document.body.classList.remove("has-cold-preview");
  }

  function updateColdKnowledgePreview(index) {
    const preview = document.getElementById("cold-card-preview");
    const card = coldKnowledgeGallery[index];
    if (!preview || !card) return;
    const image = preview.querySelector("img");
    const title = preview.querySelector(".cold-card-preview-title");
    const count = preview.querySelector(".cold-card-preview-count");
    state.coldPreviewIndex = index;
    preview.dataset.currentIndex = String(index);
    image.src = optimizedImageSrc(card.src);
    image.alt = card.alt || card.title;
    title.textContent = `${card.sectionTitle} · ${card.title}`;
    count.textContent = `${index + 1} / ${coldKnowledgeGallery.length}`;
    preloadColdKnowledgePreviewNeighbor(index + 1);
    preloadColdKnowledgePreviewNeighbor(index - 1);
  }

  function stepColdKnowledgePreview(step) {
    if (!isColdKnowledgePreviewOpen() || !step) return;
    updateColdKnowledgePreview(normalizeColdKnowledgeIndex(state.coldPreviewIndex + step));
  }

  function normalizeColdKnowledgeIndex(index) {
    const total = coldKnowledgeGallery.length;
    if (!total) return 0;
    const safeIndex = Number.isFinite(index) ? index : 0;
    return ((safeIndex % total) + total) % total;
  }

  function isColdKnowledgePreviewOpen() {
    return document.getElementById("cold-card-preview")?.classList.contains("is-open");
  }

  function onColdKnowledgePreviewWheel(event) {
    if (!isColdKnowledgePreviewOpen()) return;
    const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(dominantDelta) < 8) return;
    event.preventDefault();
    const now = window.performance.now();
    if (now - state.coldPreviewWheelAt < 220) return;
    state.coldPreviewWheelAt = now;
    stepColdKnowledgePreview(dominantDelta > 0 ? 1 : -1);
  }

  function preloadColdKnowledgePreviewNeighbor(index) {
    const card = coldKnowledgeGallery[normalizeColdKnowledgeIndex(index)];
    if (!card) return;
    const image = new Image();
    image.src = optimizedImageSrc(card.src);
  }

  function bindEvents() {
    document.querySelectorAll("[data-go]").forEach((button) => {
      button.addEventListener("click", () => navigate(button.dataset.go));
    });
    window.addEventListener("hashchange", handleRoute);
    window.addEventListener("resize", refreshScrollMetrics);

    scrollStage.addEventListener("wheel", onWheel, { passive: false });
    scrollStage.addEventListener("pointerdown", onPointerDown);
    scrollStage.addEventListener("pointermove", onPointerMove);
    scrollStage.addEventListener("pointerup", onPointerUp);
    scrollStage.addEventListener("pointercancel", onPointerUp);
    if (scrollRange) {
      scrollRange.addEventListener("input", () => {
        state.explicitActiveNode = null;
        setScrollNorm(Number(scrollRange.value) / 1000, false);
      });
    }
    document.addEventListener("keydown", onKeyDown);

    if (soundToggle) {
      soundToggle.addEventListener("click", toggleSound);
    }
    if (scrollSoundToggle) {
      scrollSoundToggle.addEventListener("click", toggleSound);
    }

    document.querySelectorAll("[data-close-node]").forEach((item) => {
      item.addEventListener("click", closeNodePanel);
    });
    document.getElementById("node-to-note").addEventListener("click", () => {
      closeNodePanel();
      navigate("notes");
    });
    document.getElementById("node-to-inquiry").addEventListener("click", () => {
      closeNodePanel();
      navigate("inquiry");
    });

    if (inquiryForm) {
      inquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = new FormData(inquiryForm);
        inquiries.unshift({
          id: `local-${Date.now()}`,
          type: form.get("type"),
          title: form.get("title"),
          status: "待核验",
          related: relatedLabel(String(form.get("related"))),
          content: form.get("content") || "待补说明。",
        });
        inquiryForm.reset();
        state.inquiryFilter = "all";
        renderInquiryList();
      });
    }

    document.querySelectorAll(".inquiry-entry").forEach((button) => {
      button.addEventListener("click", () => {
        state.inquiryFilter = button.dataset.filter || button.dataset.type || "all";
        document.querySelectorAll(".inquiry-entry").forEach((entry) => entry.classList.remove("is-current"));
        button.classList.add("is-current");
        renderInquiryList();
      });
    });

    document.querySelectorAll("[data-cold-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        scrollToColdSection(button.dataset.coldJump);
      });
    });
  }

  function scrollToColdSection(sectionId) {
    const section = coldKnowledgeRoot?.querySelector(`[data-cold-section="${sectionId}"]`);
    if (!section) return;
    section.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function navigate(target) {
    window.location.hash = target;
  }

  function handleRoute() {
    const rawHash = window.location.hash.replace(/^#/, "") || "landing";
    const [route, queryString = ""] = rawHash.split("?");
    const nextView = ["landing", "map", "scroll", "notes", "inquiry"].includes(route) ? route : "landing";
    state.view = nextView;
    document.body.dataset.view = nextView;
    views.forEach((view) => view.classList.toggle("is-active", view.id === nextView));
    shell.hidden = nextView === "landing";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-current", link.dataset.nav === nextView);
    });

    if (nextView === "scroll") {
      const params = new URLSearchParams(queryString);
      const target = params.get("target");
      if (target) {
        state.pendingTarget = target;
        refreshScrollMetrics();
        requestAnimationFrame(() => {
          locateNode(target, !prefersReducedMotion);
        });
      }
      scrollStage.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function refreshScrollMetrics() {
    const images = Array.from(scrollTrack.querySelectorAll(".scroll-panorama-image"));
    const frames = Array.from(scrollTrack.querySelectorAll(".scroll-segment-frame"));
    if (!images.length || !frames.length) return;
    const stageRect = scrollStage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) return;
    const visualHeight = Math.max(1, stageRect.height * state.scrollZoom);
    const fullWidths = images.map((image, index) => {
      const segment = scrollSegments[index];
      const sourceWidth = image.naturalWidth || segment.width;
      const sourceHeight = image.naturalHeight || segment.height;
      return visualHeight * (sourceWidth / sourceHeight);
    });
    const displayWidths = images.map((image, index) => {
      const segment = scrollSegments[index];
      const sourceWidth = image.naturalWidth || segment.width;
      const scale = fullWidths[index] / sourceWidth;
      return fullWidths[index] - ((segment.cropLeft || 0) + (segment.cropRight || 0)) * scale;
    });
    const visualWidth = displayWidths.reduce((sum, width) => sum + width, 0);
    state.scrollWidth = visualWidth;
    state.scrollHeight = visualHeight;
    state.scrollMaxOffset = Math.max(0, visualWidth - stageRect.width);
    state.scrollMaxYOffset = Math.max(0, (visualHeight - stageRect.height) / 2);
    state.scrollOffsetY = clampScrollOffsetY(state.scrollOffsetY);
    scrollTrack.style.width = `${visualWidth}px`;
    scrollTrack.style.height = `${visualHeight}px`;
    scrollTrack.style.top = `${(stageRect.height - visualHeight) / 2}px`;
    images.forEach((image, index) => {
      const segment = scrollSegments[index];
      const sourceWidth = image.naturalWidth || segment.width;
      const cropLeft = (segment.cropLeft || 0) * (fullWidths[index] / sourceWidth);
      frames[index].style.width = `${displayWidths[index]}px`;
      frames[index].style.height = "100%";
      image.style.width = `${fullWidths[index]}px`;
      image.style.height = "100%";
      image.style.transform = `translate3d(${-cropLeft}px, 0, 0)`;
    });
    if (state.pendingTarget) {
      locateNode(state.pendingTarget, false);
      state.pendingTarget = null;
    }
    applyScrollPosition();
  }

  function onWheel(event) {
    event.preventDefault();
    state.explicitActiveNode = null;
    const stageRect = scrollStage.getBoundingClientRect();
    const anchorX = Math.min(stageRect.width, Math.max(0, event.clientX - stageRect.left));
    const anchorY = Math.min(stageRect.height, Math.max(0, event.clientY - stageRect.top));
    const zoomDelta = event.deltaY > 0 ? -0.08 : 0.08;
    setScrollZoom(state.scrollZoom + zoomDelta, anchorX, anchorY);
  }

  function onPointerDown(event) {
    if (event.target.closest(".scroll-node-hotspot")) return;
    state.dragging = true;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    scrollStage.classList.add("is-dragging");
    scrollStage.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!state.dragging) return;
    const deltaX = state.lastPointerX - event.clientX;
    const deltaY = event.clientY - state.lastPointerY;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    moveByPixels(deltaX);
    moveVerticallyByPixels(deltaY);
  }

  function onPointerUp(event) {
    if (!state.dragging) return;
    state.dragging = false;
    scrollStage.classList.remove("is-dragging");
    if (scrollStage.hasPointerCapture(event.pointerId)) {
      scrollStage.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event) {
    if (isColdKnowledgePreviewOpen()) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeColdKnowledgePreview();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        stepColdKnowledgePreview(1);
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        stepColdKnowledgePreview(-1);
        return;
      }
    }
    if (event.key === "Escape") {
      closeNodePanel();
      return;
    }
    if (state.view !== "scroll") return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveByPixels(scrollStage.clientWidth * 0.16);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveByPixels(-scrollStage.clientWidth * 0.16);
    }
    if (event.key === "Home") {
      event.preventDefault();
      state.explicitActiveNode = null;
      setScrollNorm(0, !prefersReducedMotion);
    }
    if (event.key === "End") {
      event.preventDefault();
      state.explicitActiveNode = null;
      setScrollNorm(0.98, !prefersReducedMotion);
    }
  }

  function moveByPixels(delta) {
    state.explicitActiveNode = null;
    const divisor = Math.max(1, state.scrollMaxOffset);
    setScrollNorm(state.currentNorm + delta / divisor, false);
  }

  function moveVerticallyByPixels(delta) {
    if (!state.scrollMaxYOffset) return;
    setScrollOffsetY(state.scrollOffsetY + delta);
  }

  function clampScrollOffsetY(offset) {
    const limit = state.scrollMaxYOffset || 0;
    return Math.min(limit, Math.max(-limit, offset));
  }

  function setScrollOffsetY(offset) {
    const clamped = clampScrollOffsetY(offset);
    if (Math.abs(clamped - state.scrollOffsetY) < 0.1) return;
    state.scrollOffsetY = clamped;
    applyScrollPosition();
  }

  function setScrollNorm(norm, smooth) {
    const clamped = Math.min(1, Math.max(0, norm));
    if (smooth && !prefersReducedMotion) {
      state.targetNorm = clamped;
    } else {
      state.currentNorm = clamped;
      state.targetNorm = clamped;
      applyScrollPosition();
    }
  }

  function setScrollZoom(zoom, anchorX, anchorY) {
    const nextZoom = Math.min(2.4, Math.max(1, zoom));
    if (Math.abs(nextZoom - state.scrollZoom) < 0.001) return;

    const stageRect = scrollStage.getBoundingClientRect();
    const stageWidth = scrollStage.clientWidth || stageRect.width || 1;
    const stageHeight = scrollStage.clientHeight || stageRect.height || 1;
    const zoomAnchorX = Number.isFinite(anchorX)
      ? Math.min(stageWidth, Math.max(0, anchorX))
      : stageWidth / 2;
    const zoomAnchorY = Number.isFinite(anchorY)
      ? Math.min(stageHeight, Math.max(0, anchorY))
      : stageHeight / 2;
    const previousWidth = Math.max(1, state.scrollWidth);
    const previousHeight = Math.max(1, state.scrollHeight);
    const previousOffset = state.currentNorm * Math.max(0, state.scrollMaxOffset);
    const previousTop = (stageHeight - previousHeight) / 2 + state.scrollOffsetY;
    const anchorRatio = Math.min(1, Math.max(0, (previousOffset + zoomAnchorX) / previousWidth));
    const verticalAnchorRatio = Math.min(1, Math.max(0, (zoomAnchorY - previousTop) / previousHeight));

    state.scrollZoom = nextZoom;
    refreshScrollMetrics();
    const nextBaseTop = (stageHeight - state.scrollHeight) / 2;
    state.scrollOffsetY = clampScrollOffsetY(zoomAnchorY - nextBaseTop - verticalAnchorRatio * state.scrollHeight);
    const nextOffset = anchorRatio * state.scrollWidth - zoomAnchorX;
    const nextNorm = nextOffset / Math.max(1, state.scrollMaxOffset);
    setScrollNorm(nextNorm, false);
  }

  function locateNode(id, smooth) {
    const target = findScrollTarget(id);
    if (!target) return;
    state.explicitActiveNode = scrollPanoramaNodes.some((entry) => entry.id === id) ? id : null;
    const targetOffset = target.position.x * state.scrollWidth - scrollStage.clientWidth / 2;
    const targetNorm = targetOffset / Math.max(1, state.scrollMaxOffset);
    setScrollNorm(targetNorm, smooth);
    updateActiveNode(id);
  }

  function selectNode(id, openPanel) {
    const item = scrollPanoramaNodes.find((entry) => entry.id === id);
    if (!item) return;
    state.selectedNode = id;
    locateNode(id, false);
    updateActiveNode(id);
    if (openPanel) openNodePanel(item);
  }

  function applyScrollPosition() {
    const x = -state.currentNorm * state.scrollMaxOffset;
    scrollTrack.style.transform = `translate3d(${x}px, ${state.scrollOffsetY}px, 0)`;
    if (scrollRange) {
      scrollRange.value = String(Math.round(state.currentNorm * 1000));
    }
    updateNearestNode();
  }

  function tick() {
    const diff = state.targetNorm - state.currentNorm;
    if (Math.abs(diff) > 0.0005) {
      state.currentNorm = Math.min(1, Math.max(0, state.currentNorm + diff * 0.08));
      applyScrollPosition();
    }
    requestAnimationFrame(tick);
  }

  function updateNearestNode() {
    if (state.explicitActiveNode) {
      updateActiveNode(state.explicitActiveNode);
      return;
    }
    let nearest = scrollPanoramaNodes[0];
    let nearestDistance = 1;
    const viewportCenter = state.currentNorm * state.scrollMaxOffset + scrollStage.clientWidth / 2;
    const centerNorm = viewportCenter / Math.max(1, state.scrollWidth);
    scrollPanoramaNodes.forEach((item) => {
      const distance = Math.abs(item.position.x - centerNorm);
      if (distance < nearestDistance) {
        nearest = item;
        nearestDistance = distance;
      }
    });
    if (nearestDistance < 0.04) updateActiveNode(nearest.id);
  }

  function updateActiveNode(id) {
    document.querySelectorAll(".scroll-node-hotspot").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.node === id);
    });
    document.querySelectorAll(".node-pill").forEach((button) => {
      button.classList.toggle("is-active", button.textContent.includes(labelForNode(id)));
    });
  }

  function openNodePanel(item) {
    const panel = nodeOverlay.querySelector(".node-panel");
    const status = document.getElementById("node-panel-status");
    const title = document.getElementById("node-panel-title");
    const subtitle = document.getElementById("node-panel-subtitle");
    const summary = document.getElementById("node-panel-summary");
    const detail = document.getElementById("node-panel-detail");
    const meta = nodeOverlay.querySelector(".node-meta");
    const actions = nodeOverlay.querySelector(".panel-actions");
    const displayTitle = compactNodeTitle(item.title);

    panel.classList.remove("bridge-detail-card");
    title.classList.remove("is-long-title", "is-very-long-title");
    title.classList.toggle("is-long-title", displayTitle.length >= 5);
    title.classList.toggle("is-very-long-title", displayTitle.length >= 7);
    title.title = item.title;
    status.hidden = false;
    summary.hidden = false;
    meta.hidden = false;
    actions.hidden = false;
    detail.innerHTML = "";

    if (item.card) {
      panel.classList.add("bridge-detail-card");
      status.textContent = item.card.status;
      status.dataset.status = "较可信";
      title.textContent = displayTitle;
      subtitle.textContent = item.card.pinyin;
      summary.hidden = true;
      meta.hidden = true;
      actions.hidden = true;
      detail.innerHTML = `
        <div class="bridge-card-intro">
          ${item.card.intro.map((label) => `<span>${label}</span>`).join("")}
        </div>
        <div class="bridge-card-sections">
          ${item.card.sections.map(([label, text]) => bridgeSection(label, text)).join("")}
        </div>
        <span class="bridge-card-seal" aria-hidden="true">${item.card.seal}</span>
      `;
    } else {
      status.textContent = item.sourceStatus;
      status.dataset.status = item.sourceStatus;
      title.textContent = displayTitle;
      subtitle.textContent = item.subtitle;
      summary.textContent = item.summary;
      document.getElementById("node-panel-category").textContent = item.category;
      document.getElementById("node-panel-source").textContent = item.source;
    }
    nodeOverlay.hidden = false;
    nodeOverlay.querySelector(".panel-close").focus({ preventScroll: true });
  }

  function markerLabelMarkup(label) {
    return Array.from(label).map((char) => `<span class="bridge-marker-char">${char}</span>`).join("");
  }

  function compactNodeTitle(title) {
    const withoutAlias = title.replace(/[（(][^）)]*[）)]\s*$/, "");
    return title.length > 6 && withoutAlias ? withoutAlias : title;
  }

  function bridgeSection(label, text) {
    return `
      <section class="bridge-card-section">
        <h4>【${label}】</h4>
        <p>${text}</p>
      </section>
    `;
  }

  function closeNodePanel() {
    nodeOverlay.hidden = true;
    if (state.view === "scroll") scrollStage.focus({ preventScroll: true });
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      ensureAudio();
      audioContext.resume();
      masterGain.gain.setTargetAtTime(0.22, audioContext.currentTime, 0.12);
    } else if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
    }
    updateSoundButtons();
    updateAudioZone();
  }

  function ensureAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioContext.destination);

    audioZones.forEach((zone) => {
      const osc = audioContext.createOscillator();
      const filter = audioContext.createBiquadFilter();
      const gain = audioContext.createGain();
      osc.type = zone.id === "market" ? "triangle" : "sine";
      osc.frequency.value = zone.frequency;
      filter.type = "lowpass";
      filter.frequency.value = zone.id === "market" ? 760 : 420;
      gain.gain.value = 0;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();
      zoneGains[zone.id] = gain;
    });
  }

  function updateSoundButtons() {
    const label = state.soundEnabled ? "声景 开" : "声景 关";
    if (soundToggle) {
      soundToggle.textContent = label;
      soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
    }
    if (scrollSoundToggle) {
      scrollSoundToggle.textContent = label;
      scrollSoundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
    }
  }

  function updateAudioZone() {
    const zone = audioZones.find((item) => state.currentNorm >= item.start && state.currentNorm < item.end) || audioZones[0];
    state.activeAudioZone = zone.id;
    if (activeZoneLabel) {
      activeZoneLabel.textContent = `声景区域：${zone.label}`;
    }
    if (!audioContext || !state.soundEnabled) return;
    audioZones.forEach((item) => {
      const gain = zoneGains[item.id];
      if (!gain) return;
      gain.gain.setTargetAtTime(item.id === zone.id ? 0.28 : 0.03, audioContext.currentTime, 0.18);
    });
  }

  function labelForNode(id) {
    const item = scrollPanoramaNodes.find((entry) => entry.id === id) || scrollNodes.find((entry) => entry.id === id);
    if (!item) {
      const segment = scrollSegments.find((entry) => entry.id === id || (entry.aliases || []).includes(id));
      if (segment) return segment.title;
    }
    return item ? item.title : id;
  }

  function relatedLabel(id) {
    const point = mapPoints.find((item) => item.id === id);
    if (point) return point.label;
    const item = scrollPanoramaNodes.find((entry) => entry.id === id) || scrollNodes.find((entry) => entry.id === id);
    if (item) return item.title;
    const note = notes.find((entry) => entry.id === id);
    if (note) return note.title;
    return "全局问题";
  }

  function typeLabel(type) {
    const labels = {
      question: "问题",
      discussion: "讨论",
      clue: "线索",
      correction: "勘误",
      task: "共创任务",
    };
    return labels[type] || type;
  }

  init();
})();
