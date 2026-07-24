const wasteInfo = {
  GLASS: {
    color: "waste-glass",
    process:
      "Rửa sạch, để ráo. Tách riêng thủy tinh vỡ để tránh gây thương tích cho người thu gom.",
    should: ["Gói thủy tinh vỡ bằng giấy báo trước khi bỏ", "Phân loại riêng theo màu nếu có thể"],
    avoid: ["Không đập vỡ thêm để tiết kiệm diện tích", "Không trộn chung với rác hữu cơ ướt"],
  },
  METAL: {
    color: "waste-metal",
    process:
      "Rửa sạch phần dính thức ăn (lon, hộp), làm dẹp để tiết kiệm không gian trước khi đem đi tái chế.",
    should: ["Gom lại và bán cho vựa ve chai", "Tách nắp nhựa/nhãn giấy nếu có thể"],
    avoid: ["Không đốt để lấy kim loại", "Không bỏ chung với bình xịt còn áp suất"],
  },
  CARDBOARD: {
    color: "waste-cardboard",
    process:
      "Gỡ bỏ băng keo, ghim bấm, làm phẳng hộp giấy để dễ xếp gọn và tái chế hiệu quả.",
    should: ["Giữ khô ráo trước khi bỏ vào rác tái chế", "Gấp gọn để tiết kiệm diện tích"],
    avoid: ["Không để dính dầu mỡ, nước (giảm khả năng tái chế)", "Không đốt ngoài trời"],
  },
  BIODEGRADABLE: {
    color: "waste-organic",
    process:
      "Có thể ủ phân compost tại nhà, hoặc bỏ vào rác hữu cơ để đơn vị thu gom xử lý sinh học.",
    should: ["Ủ phân hữu cơ nếu có điều kiện", "Đổ riêng, không lẫn túi nylon"],
    avoid: ["Không đổ xuống cống/kênh rạch", "Không đốt gây khói bụi"],
  },
  PLASTIC: {
    color: "waste-plastic",
    process:
      "Rửa sạch, phơi khô, ép dẹp chai/hộp nhựa. Kiểm tra ký hiệu tái chế (số 1–7) dưới đáy sản phẩm.",
    should: ["Tách nắp và nhãn nếu khác loại nhựa", "Gom theo loại nếu khu vực có thu gom riêng"],
    avoid: ["Không đốt nhựa (sinh khí độc)", "Không tái sử dụng đựng thực phẩm nếu đã cũ/trầy xước"],
  },
  PAPER: {
    color: "waste-paper",
    process:
      "Giữ khô, sạch, không dính dầu mỡ. Gom thành xấp để dễ vận chuyển đến điểm tái chế.",
    should: ["Tách riêng giấy sạch và giấy đã qua sử dụng nhiều lần", "Bán cho ve chai nếu số lượng lớn"],
    avoid: ["Không để ướt hoặc dính thực phẩm", "Không xé vụn quá nhỏ (khó tái chế)"],
  },
};

export default wasteInfo;