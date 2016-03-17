class Solution{
	public:
		void partitionArray(vertor<int> &nums){
			int start = 0,
				end = nums.size() - 1;
			while(start<end){
				while(start<end && nums[start]%2 == 1)++start;
				while(start<end && nums[end]%2 == 0)--end;
				if(start<end)swap(nums[start++],nums[end--]);
			}
		}	int i = 0;
		for(;i<nums.size();++i){
			
		}
};