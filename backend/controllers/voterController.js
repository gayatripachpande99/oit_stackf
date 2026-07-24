const Voter = require('../models/Voter');

exports.getVoters = async (req, res) => {
    try {
        const { segment, boothNumber } = req.query;
        let query = {};
        let isFiltered = false;

        if (segment) {
            const normalizedSegment = String(segment).trim();
            query.$or = [
                { segment: normalizedSegment },
                { ward: normalizedSegment },
                { area: normalizedSegment },
                { segment: { $regex: normalizedSegment, $options: 'i' } },
                { ward: { $regex: normalizedSegment, $options: 'i' } },
                { area: { $regex: normalizedSegment, $options: 'i' } }
            ];
            isFiltered = true;
        }

        if (boothNumber) {
            const parsedBooth = parseInt(boothNumber);
            if (!isNaN(parsedBooth)) {
                // If query.$or already exists, we must ensure boothNumber is matched along with segment
                // To keep it simple, we filter matching records using a compound query
                if (query.$or) {
                    // Match segment AND boothNumber
                    query = {
                        $and: [
                            { $or: query.$or },
                            {
                                $or: [
                                    { boothNumber: parsedBooth },
                                    { boothNumber: String(parsedBooth) }
                                ]
                            }
                        ]
                    };
                } else {
                    query.$or = [
                        { boothNumber: parsedBooth },
                        { boothNumber: String(parsedBooth) }
                    ];
                }
            } else {
                query.boothNumber = boothNumber;
            }
            isFiltered = true;
        }

        let voters = await Voter.find(query).limit(100).lean();

        if (voters.length === 0 && !isFiltered) {
            voters = await Voter.find({}).limit(100).lean();
        }

        res.status(200).json({
            success: true,
            count: voters.length,
            isFiltered,
            data: voters
        });
    } catch (error) {
        console.error('[Voters API] Error fetching voters:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error while fetching voters'
        });
    }
};
